export type UserSigninInformation = {
    email: string;
    password: string;
};
function validateUser(values: UserSigninInformation){
    const errors: {email: string; password: string} ={
        email:"",
        password:"",
    };
if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){
    errors.email = "이메일 형식에 맞지 않습니다.";
    }

    if(values.password.length < 8 || values.password.length > 20){
        errors.password = "비밀번호는 8자 이상 20자 이하여야 합니다.";
    }

    return errors;
}

function validateSignin (value:UserSigninInformation){
     return validateUser(value);
}

export {validateSignin};