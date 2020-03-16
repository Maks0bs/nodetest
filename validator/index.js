exports.createPostValidator = (req, res, next) => {
	//for title
	req.check('title', "Write a title").notEmpty();
	req.check('title', 'Title must be between 4 to 150 characters').isLength({
		min: 4,
		max: 150
	});

	req.check('body', "Write a body").notEmpty();
	req.check('body', 'Title must be between 4 to 2000 characters').isLength({
		min: 4,
		max: 2000
	});
	//check for errors
	let errors = req.validationErrors();
	//if error show the first one as they appear
	if (errors){
		let firstError = errors.map((error) => error.msg)[0];
		return res.status(400).json({
			error: firstError
		})
	}

	next();
}

exports.userSignupValidator = (req, res, next) => {
	//name is not null and between 4-10 chars
	req.check("name", "Name is required").notEmpty();
	//email is not null
	req.check("email", "Email is required").notEmpty();
	req.check("email", "Email must be beetween 3 to 32 characters")
	.matches(/.+\@.+\..+/)
	.withMessage("Email must contain @")
	.isLength({
		min: 4,
		max: 2000
	})
	//check for password
	req.check("password", "Password is required").notEmpty();
	req.check('password')
	.isLength({min : 6})
	.withMessage("Password must contain at least 6 characters")
	.matches(/\d/)
	.withMessage("Password must contain a number");

	//check for errors
	let errors = req.validationErrors();
	//if error show the first one as they appear
	if (errors){
		let firstError = errors.map((error) => error.msg)[0];
		return res.status(400).json({
			error: firstError
		})
	}

	next();
}

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("Password must contain a number");
 
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};