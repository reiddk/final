exports.verifyZip = (value) => {
    if (value.match(/^\d{5}(?:[-\s]\d{4})?$/)) {
      return true;
    }
    throw new Error('Zip does not match zip code pattern');
}


exports.verifyPhonePattern = (value) => {
    if (value.match(/^[0-9\-\(\)\s]*$/)) {
      return true;
    }
    throw new Error('Phone number does not match phone number pattern');
}

exports.isAnInteger = (value) => {
    if (isNaN(value)) {
        throw new Error('Is not a number');
    } else if (Math.ceil(Number(value)) !== Number(value)) {
        throw new Error('Is not an integer');
    }
    return true;
}

exports.uniqueEmail = async (value, model) => {
    return await new Promise((resolve, reject) => {
        model.findByEmail(value, (err, result) => {
            if (err && err.kind === 'not_found') {
                return resolve();
            }
            return reject('Email already exists in the database');
        });
    }); 
}