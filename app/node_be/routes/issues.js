const { Issue, validate } = require('../models/issue');
const { validateNote } =  require('../models/note');
const authorize = require('../utils/authorize');
const admin = require('../utils/admin');
const validateObjId = require('../utils/validateObjId');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// get all issues
router.get('/', authorize, async (req, res) => {
  const pageNum = (req.query.page) ? (req.query.page) : 1;
  const pageSize = 6;
  const order = (req.query.order === 'asc') ? 1 : -1;
  const sortBy = (req.query.sort) ? (req.query.sort) : "created_on";
  const issues = await Issue
                        .find({created_by_id : req.user._id})
                        .skip((pageNum - 1) * pageSize)
                        .limit(pageSize)
                        .sort({ [sortBy] : order });
	res.send(issues);
});


// create a new issue
router.post('/', authorize, async (req, res) => {

	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let issue = new Issue({
    created_by: req.body.created_by,
    created_by_id: req.body.created_by_id,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority
	});

  issue = await issue.save();
	res.send(issue);
});


// get an issue by id
router.get('/:id', [authorize, validateObjId], async (req, res) => {

  const isOwner = await Issue.findOne({ _id : req.params.id, created_by_id : req.user._id });
  if (!isOwner) return res.status(404).send("issue with given ID was not found");

	const issue = await Issue.findById(req.params.id);
	if (!issue) return res.status(404).send("Error with database get");
	res.send(issue);
});


// edit an issue
router.put('/:id', [authorize, validateObjId], async (req, res) => {

  const {error} = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
  const isOwner = await Issue.findOne({ _id : req.params.id, created_by_id : req.user._id });
  if (!isOwner) return res.status(404).send("issue with given ID was not found");
  const issue = await Issue.findByIdAndUpdate(req.params.id,
    {
      created_by: req.body.created_by,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority
    },
    { new : true }
  );
	if (!issue) return res.status(404).send("database error");
	res.send(issue);
});


// delete an issue
router.delete('/:id', [authorize, validateObjId], async (req, res) => {

  const isOwner = await Issue.findOne({ _id : req.params.id, created_by_id : req.user._id });
  if (!isOwner) return res.status(404).send("issue with given ID was not found");

	const issue = await Issue.findByIdAndRemove(req.params.id);
	if (!issue) return res.status(404).send("database error");
	res.send(issue);
});


// to add note
router.post('/:id/notes', [authorize, validateObjId], async (req, res) => {

  let issue = await Issue.findById(req.params.id);
	if (!issue) return res.status(404).send("issue with given ID was not found");

  const { error } = validateNote(req.body);
	if (error) return res.status(400).send(error.details[0].message);

  const result = await Issue.update({ "_id" : req.params.id },
    { $push: { notes : req.body }
  });
  res.send(result);
});


// to delete a note
router.post('/:id/notes/:note_id', [authorize, validateObjId], async (req, res) => {

  let issue = await Issue.findById(req.params.id);
	if (!issue) return res.status(404).send("issue with given ID was not found");

  const result = await Issue.update({ "_id" : req.params.id },
    { $pull: {notes : { "_id" : req.params.note_id }}
  });
	if (!result.nModified) return res.status(404).send("note with given ID was not found");

	res.send(result);
});


// to edit a note
router.post('/:id/notes/:note_id/edit', [authorize, validateObjId], async (req, res) => {

  let issue = await Issue.findById(req.params.id);
	if (!issue) return res.status(404).send("issue with given ID was not found");

  const result = await Issue.update({ "_id" : req.params.id },
    { $set: { "notes.$[e].message" : req.body.message, "notes.$[e].author" : req.body.author }},
    { arrayFilters: [{ "e._id": mongoose.Types.ObjectId(req.params.note_id) }]}
  );
	if (!result.nModified) return res.status(404).send("note with given ID was not found");

	res.send(result);
});


module.exports = router;
