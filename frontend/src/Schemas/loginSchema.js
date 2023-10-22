import * as Yup from "yup";
const passswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const errorMessage = "use lowercase, uppercasea and digits";

const loginSchema = Yup.object().shape({
  username: Yup.string().min(5).max(30).required("Username is required"),
  password: Yup.string()
    .min(8)
    .max(25)
    .matches(passswordPattern, { message: errorMessage })
    .required("Password is required"),
});

export default loginSchema;
