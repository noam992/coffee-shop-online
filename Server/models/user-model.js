const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "Missing first name"],
        minlength: [1, "name too short"],
        maxlength: [70, "name too long"]
    },

    lastName: {
        type: String,
        required: [true, "Missing last name"],
        minlength: [1, "name too short"],
        maxlength: [70, "name too long"]
    },

    email: {
        type: String,
        required: [true, "Missing email"],
        validate: {
            validator: value => /^\w+[\w-\.]*\@([\w-]+\.)+[\w-]+$/.test(value),
            message: "Invalid email"
        }
    },

    identityCard: {
        type: Number,
        required: [true, "Missing product name"],
        validate: {
            validator: value => /^\d{9}$/.test(value),
            message: "ID must be 9 numbers."
        }
    },

    password: {
        type: String,
        required: [true, "Missing product name"],
        validate: {
            validator: value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
            message: "Password must be minimum eight characters, at least one letter and one number."
        }
    },

    address: {
        type: String,
        required: [false, "Missing address"],
        minlength: [1, "name too short"],
        maxlength: [70, "name too long"]
    },

    phoneNumbers: {
        homeNumber: {
            type: String,
            required: [false, "Missing home number"],
            validate: {
                validator: value => /^0[23489]{1}(\-)?[^0\D]{1}\d{6}$/.test(value),
                message: "Phone number inside israel. xx-xxxxxxx(format)"
            }
        },
        smartPhoneOne: {
            type: String,
            required: [true, "Missing phone number"],
            validate: {
                validator: value => /^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$/.test(value),
                message: "Phone number inside israel. xxx-xxxxxxx(format) | 972xxxxxxxxx(format)"
            }
        },
        smartPhoneTwo: {
            type: String,
            required: [false, "Missing phone number"],
            validate: {
                validator: value => /^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$/.test(value),
                message: "Phone number inside israel. xxx-xxxxxxx(format) | 972xxxxxxxxx(format)"
            }
        },
        smartPhoneThree: {
            type: String,
            required: [false, "Missing phone number"],
            validate: {
                validator: value => /^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$/.test(value),
                message: "Phone number inside israel. xxx-xxxxxxx(format) | 972xxxxxxxxx(format)"
            }
        },
    },

    isAdmin: {
        type: Number,
        required: [true, "Missing user status"],
        validate: {
            validator: value => /^[0|1]$/.test(value),
            message: "User status is number 0 or 1"
        }
    },
    
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing city"],
        ref: "City"
    }

}, { 
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

UserSchema.virtual("city", {
    ref: "City",
    localField: "cityId",
    foreignField: "_id",
    justOne: true,
})


const User = mongoose.model("User", UserSchema, "Users");

module.exports = User;