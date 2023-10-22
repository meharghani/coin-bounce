import * as Yup from "yup";
const passswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const errorMessage = "use lowercase, uppercasea and digits";
const signupSchema = Yup.object().shape({
  name: Yup.string().max(30).required("Name is required"),
  username: Yup.string().max(30).min(5).required("Username is required"),
  email: Yup.string().email("Enter Valid Email").required("Email is required"),
  password: Yup.string()
    .min(8)
    .max(25)
    .matches(passswordPattern, { message: errorMessage })
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "password must match")
    .required("Confirm password is required"),
});

export default signupSchema;
