import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { green, grey, pink } from "@mui/material/colors";
import { Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";

export default function Index() {
  const [gender, setGender] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Dummy error!!!!");
  const [formIndex, setFormIndex] = useState(0);
  function genderButtonHandler(gender: string) {
    if (gender === "M") setGender("MALE");
    else if (gender === "F") setGender("FEMALE");
  }

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().min(2, "Too Short!").max(5, "Too Long!").required("Required"),
    lastName: Yup.string().min(2, "Too Short!").max(5, "Too Long!").required("Required"),
    nik: Yup.string().min(2, "Too Short!").max(5, "Too Long!").required("Required"),
    gender: Yup.string().min(2, "Too Short!").max(5, "Too Long!").required("Required"),
  });

  return (
    <main className={`h-screen w-screen flex justify-center items-center relative`}>
      <div className="bg-black bg-opacity-[.35] h-[862px] w-[487px] rounded-2xl absolute">
        <div className="h-[10%] w-full">
          <h1 className="text-center text-4xl font-bold text-white mt-10 ">REGISTRATION PAGE</h1>
          <hr className=" ml-[10%] mt-7 w-4/5 border-[#FF5A5A] border-[1px] mb-10" />

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              nik: "",
              gender: "",
              username: "",
              email: "",
              password: "",
              cPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, actions) => {
              console.log("values: ", values);
              actions.setSubmitting(false);
              actions.resetForm();
              console.log("submit");
            }}
          >
            {(props) => {
              // console.log(props);
              return (
                <form className="ml-7 mr-7" onSubmit={props.handleSubmit}>
                  {formIndex === 0 ? (
                    <>
                      <>
                        <div className="flex flex-col ">
                          <label htmlFor="firstName" className={`text-xl relative + ${!props.errors.firstName ? "text-white" : "text-red-300"} `}>
                            First Name
                            {props.errors.firstName ? <p className="absolute top-[70px] text-yellow-300">{props.errors.firstName}</p> : null}
                          </label>

                          <input
                            type="text"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.firstName}
                            name={"firstName"}
                            id="firstName"
                            className={`h-10 bg-transparent border-b-[1px] text-white  focus:outline-0  text-xl mb-10 ${!props.errors.firstName ? " border-white" : "border-red-300"}`}
                          />

                          <label htmlFor="lastName" className="text-white text-xl">
                            Last Name
                          </label>
                          <input
                            type="text"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.lastName}
                            name={"lastName"}
                            id="lastName"
                            className="h-10 bg-transparent border-b-[1px] border-white focus:outline-0 text-white text-xl mb-10"
                          />
                          <label htmlFor="NIK" className="text-white text-xl">
                            NIK
                          </label>
                          <input
                            type="text"
                            id="nik"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.nik}
                            name={"nik"}
                            className="h-10 bg-transparent border-b-[1px] border-white focus:outline-0 text-white text-xl mb-10"
                          />
                          <h1 className="text-center text-white text-xl font-bold mb-7">Gender</h1>

                          <div className="w-full flex justify-evenly  items-center">
                            <button
                              name={props.values.gender}
                              type="button"
                              className="h-14 w-32 bg-black bg-opacity-[.25] rounded-xl font-bold text-2xl text-white border-[1px] border-red-500"
                              value={"M"}
                              onClick={(choice: any) => {
                                genderButtonHandler(choice.target.value);
                                props.values.gender = "M";
                              }}
                            >
                              {gender === "MALE" ? (
                                <CircleIcon sx={{ fontSize: 20, color: green[400] }} className="relative bottom-[1px] mr-1" />
                              ) : (
                                <CircleOutlinedIcon sx={{ fontSize: 20, color: grey[900] }} className="relative bottom-[1px] mr-1" />
                              )}
                              Male
                            </button>
                            <button
                              type="button"
                              name={props.values.gender}
                              className="h-14 w-32 bg-black bg-opacity-[.25] rounded-xl font-bold text-2xl text-white border-[1px] border-red-500"
                              value={"F"}
                              onClick={(choice: any) => {
                                props.values.gender = "F";
                                genderButtonHandler(choice.target.value);
                              }}
                            >
                              {gender === "FEMALE" ? (
                                <CircleIcon sx={{ fontSize: 20, color: green[400] }} className="relative bottom-[1px] mr-1" />
                              ) : (
                                <CircleOutlinedIcon sx={{ fontSize: 20, color: grey[900] }} className="relative bottom-[1px] mr-1" />
                              )}
                              Female
                            </button>
                          </div>
                          <hr className=" ml-[10%] mt-7 w-4/5 border-[#FF5A5A] border-[1px] mb-7" />
                          <div className="w-full flex justify-evenly  items-center">
                            <button type="button" className="h-14 w-44 bg-black bg-opacity-[.45] rounded-xl font-bold text-2xl text-white text-opacity-40 border-[1px] border-red-500 " disabled={true}>
                              Back
                            </button>
                            <button
                              type="button"
                              id="next"
                              className="h-14 w-44 bg-black bg-opacity-[.25] rounded-xl font-bold text-2xl text-white border-[1px] border-red-500 hover:bg-[#FFA6C6] hover:bg-opacity-[.75] active:bg-opacity-[.85] delay-75"
                              onClick={() => setFormIndex(1)}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </>
                    </>
                  ) : (
                    <>
                      <>
                        <div className="flex flex-col ">
                          <label htmlFor="username" className="text-white text-xl">
                            Username
                          </label>
                          <input
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.username}
                            name="username"
                            id="username"
                            type="text"
                            className="h-10 bg-transparent border-b-[1px] border-white focus:outline-0 text-white text-xl mb-10"
                          />
                          <label htmlFor="email" className="text-white text-xl">
                            Email
                          </label>
                          <input
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.email}
                            id="email"
                            type="email"
                            name="email"
                            className="h-10 bg-transparent border-b-[1px] border-white focus:outline-0 text-white text-xl mb-10"
                          />
                          <label htmlFor="password" className="text-white text-xl">
                            Password
                          </label>
                          <input
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.password}
                            id="password"
                            type="password"
                            name="password"
                            className="h-10 bg-transparent border-b-[1px] border-white focus:outline-0 text-white text-xl mb-10"
                          />
                          <label htmlFor="C_password" className="text-white text-xl">
                            Confirm Password
                          </label>
                          <input
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.cPassword}
                            id="cPassword"
                            type="cPassword"
                            name="cPassword"
                            className="h-10 bg-transparent border-b-[1px] border-white focus:outline-0 text-white text-xl mb-10"
                          />

                          <hr className=" ml-[10%]  w-4/5 border-[#FF5A5A] border-[1px] mb-7" />
                          <div className="w-full flex justify-evenly  items-center">
                            <button
                              type="button"
                              className="h-14 w-44 bg-black bg-opacity-[.25] rounded-xl font-bold text-2xl text-white border-[1px] border-red-500 hover:bg-[#FFA6C6] hover:bg-opacity-[.75] active:bg-opacity-[.85] delay-75"
                              onClick={() => setFormIndex(0)}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="h-14 w-44 bg-black bg-opacity-[.25] rounded-xl font-bold text-2xl text-white border-[1px] border-red-500 hover:bg-[#FFA6C6] hover:bg-opacity-[.75] active:bg-opacity-[.85] delay-75"
                              onClick={() => props.handleSubmit()}
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </>
                    </>
                  )}
                </form>
              );
            }}
          </Formik>

          <div className="flex justify-center items-center mt-7 gap-2">
            <hr className="  w-[20%] border-[#FF5A5A] border-[1px]" />
            <label htmlFor="" className="font-semibold text-base text-yellow-500">
              Already have an account?
            </label>
            <hr className="  w-[20%] border-[#FF5A5A] border-[1px] " />
          </div>
          <div className="w-full flex justify-evenly mt-7">
            <Link
              href={"/"}
              className="   h-14 w-44 bg-black bg-opacity-[.25] rounded-xl font-bold text-2xl text-white border-[1px] border-red-500 hover:bg-[#FFA6C6] hover:bg-opacity-[.75] active:bg-opacity-[.85] text-center duration-200 flex justify-center items-center"
              // onClick={() => {
              //   ro;
              // }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      {errorState && (
        <>
          <div className=" bg-black w-full h-full  z-1 bg-opacity-60 absolute flex justify-center items-center">
            <div id="modal box" className="w-[601px] h-[295px] bg-[#2B2B2B] rounded-3xl shadow-md  shadow-rose-600 border-2 border-white relative ">
              <button
                type="button"
                onClick={() => {
                  setErrorState(false);
                  setErrorMsg("");
                }}
              >
                <CloseRoundedIcon sx={{ color: "white" }} className="absolute top-4 right-5" />
              </button>
              <h1 className="text-center mt-5 font-bold text-4xl text-white mb-5">ERROR</h1>
              <div className=" flex justify-center mb-5">
                <hr className=" w-4/5" />
              </div>

              <div id="Error Content" className="bg-[#474747] rounded-xl bg-opacity-30 w-[96%] h-3/6 m-auto ">
                <p className="w-full h-full flex justify-center items-center text-white">{errorMsg}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
