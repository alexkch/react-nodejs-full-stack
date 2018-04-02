import * as actionTypes from '../../utils/actionTypes';
import update from '../../utils/update';

const initialState = {
    userId: null,
    token: null,
    name: null,
    usertype: null,
    isAdmin: false,
    users: [],
    error: false,
    errorMsg: ''
};

const reducer = ( state = initialState, action ) => {

    switch ( action.type ) {

        case actionTypes.AUTH_USER:
            return state;

        case actionTypes.AUTH_SUCCESS:
            return update(state, {
              token : action.token,
              userId : action.userId,
              name: action.name,
              usertype: action.usertype,
              isAdmin: action.isAdmin,
              error : false});

        case actionTypes.AUTH_FAIL:
            return update(state, {
              error : true,
              errorMsg : action.errorMsg});

        case actionTypes.AUTH_LOGOUT:
            return update(state, {
              token : null,
              userId : null,
              name: null,
              usertype: null,
              isAdmin: false,
              error : null});

        case actionTypes.INIT_USER:
            return state;

        case actionTypes.INIT_USER_SUCCESS:
            return update(state, {
              error : false});

        case actionTypes.INIT_USER_FAIL:
            return update(state, {
              error : true,
              errorMsg : action.errorMsg});

        case actionTypes.SET_USERS:
            return update(state, {
              error : false,
              users : action.users});

        case actionTypes.SET_USERS_FAIL:
            return update(state, {
              error : true,
              errorMsg : action.errorMsg});

        case actionTypes.SUBSCRIBE_USER_SUCCESS:
            return update(state, {
              error : false});

        case actionTypes.SUBSCRIBE_USER_FAIL:
            return update(state, {
              error : true,
              errorMsg : action.errorMsg});

        case actionTypes.UNSUBSCRIBE_USER_SUCCESS:
            return update(state, {
              error : false});

        case actionTypes.UNSUBSCRIBE_USER_FAIL:
            return update(state, {
              error : true,
              errorMsg : action.errorMsg});

        default:
            return state;
    }
};

export default reducer;
