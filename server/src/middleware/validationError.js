import { validationResult } from "express-validator";

const validationError = (req, res, next) => {
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg,
                })) 
            })
        }
        next();
    }
    catch(err){
        next(err);
    }
};

export { validationError };