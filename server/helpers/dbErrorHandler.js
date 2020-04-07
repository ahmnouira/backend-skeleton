/* Thea validation constraints added to the user schema fields, will throw error messages, 
if violated when user data is saved to the database */

// define a helper method to retun a relevant error message that can be propagated in the request-response cycle 
// as appropriate 

const getErrorMessage = (err) => {

    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something Went Wrong!'
        }
    } else {  // error don't have code
        for (let errName in err.errors) {
            // get the message from the errors object 
            if (err.errors[errName].message)
                message += '---' + err.errors[errName].message + ' '
        }
    }

    return message;
}

// Errors that are not thrown because of a Mongoose validator violation will conatin 
// an error code and in some cases need to be handled differently, for example, errors caused deue to a 
// violation of the unique constraint will return a diffrent error obejct than Mongoose 
// validation errors
const getUniqueErrorMessage = (err) => {
    let output
    try {
        let fieldName =
            err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        output = 'Unique filed amready exists'
    }

    return output;
}


export default getErrorMessage; 