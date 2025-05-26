
let EmailRegx = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
let MobileRegx = /^(?:\+88|0088)?01[3-9]\d{8}$/;


class FormValidation {
    passwordValidation(value) {
        if (value.length < 8) {
            return "Password must be at least 8 characters long";
        }
        else if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
        }
        else if (!/[a-z]/.test(value)) {
            return "Password must contain at least one lowercase letter";
        }
        else if (!/[0-9]/.test(value)) {
            return "Password must contain at least one digit";
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return "Password must contain at least one special character";
        }
        return "";
    }


    IsEmpty(value){
        return value.length === 0;
    }
    IsEmail(value){
        return EmailRegx.test(value);
    }

    ValidPhone(value){
        return MobileRegx.test(value);
    }
}

export const {
    passwordValidation,
    IsEmpty,
    IsEmail,
    ValidPhone,
} = new FormValidation();