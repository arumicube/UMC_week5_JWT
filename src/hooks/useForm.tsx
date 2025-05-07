import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T>{
    initialValues: T; // {email: ''; password: '';}
    validate: (values: T) => Record<keyof T, string>; //값이 올바른지 검증하는 함수
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState(initialValues); // {email: ''; password: ''}
    const [touched, setTouched] = useState<Record<string,boolean>>(); 
    // Record<string, boolean> : {email: true; password: false;} 처럼 키가 string이고 값이 boolean인 객체를 의미한다.
    const [errors, setErrors] = useState<Record<string, string>>(); // {email: '이메일 형식에 맞지 않습니다.'; password: ''}


    //사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, //불변성 유지 (기존값 유지)
            [name]: text,
        });
    };

    const handBlur = (name: keyof T) => {
        setTouched({
            ...touched, //불변성 유지 (기존값 유지)
            [name]: true,
        });
    };

    // 이메일 인풋, 패스워드 인풋, 속성들을 가져옴
    const getInputProps = (name: keyof T) => {
        const value = values[name]; // {email: ''; password: ''}
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
            handleChange(name, e.target.value); // {email: '이메일'; password: ''}

        const onBlur = () => handBlur(name); // {email: '이메일'; password: ''}

        return{value, onChange, onBlur}; 
    };

    // 유효성 검사
    useEffect(() => {
        const newErrors = validate(values); // {email: '이메일 형식에 맞지 않습니다.'; password: ''}
        setErrors(newErrors); //오류 메세지 업뎃
    },[validate, values]); // 유효성 검사 함수와 값이 바뀔 때마다 실행
    
    return {values, errors, getInputProps, touched};

}

export default useForm; //useForm 훅을 export 한다.