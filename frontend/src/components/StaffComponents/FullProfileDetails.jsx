import React, { useEffect, useState } from "react";
import { FaUserTie, FaPhoneAlt } from "react-icons/fa"; // react-icons for professional icon
import { IoIosMail } from "react-icons/io";
import EducationList from "../EducationList";
import CategoryList from "../CategoryList";
import PaymentHistory from "../Payments/PaymentHistory";
import ProfessionalJobListingPage from "../ProfessionalProfile/ProfessionalJobListingPage";
import { BsBank } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { USERREQUESTTYPE, USERTYPE } from "../../types";
import {
  asyncProfessionalDataReviews,
  asyncProfessionalReviewOperation,
} from "../../redux/staffSlicer";
import { useNavigate } from "react-router-dom";

const FullProfileDetails = ({ customerType, operationType, requestID }) => {
  const professionalReviews = useSelector(
    (state) => state.staffStates.professionalReviews
  );
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [rejectMsg, setRejectMsg] = useState("");
  let history = useNavigate();

  useEffect(() => {
    try {
      if (professionalReviews == null && customerType == "Professional") {
        console.log(professionalReviews);
        const prom = dispatch(asyncProfessionalDataReviews());
        prom.then((res) => {
          console.log(res.payload);
          setUserData(
            res.payload.find((element) => element.prequestid == requestID)
          );
        });
      }
      if (professionalReviews) {
        setUserData(
          professionalReviews.find((element) => element.prequestid == requestID)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  const educationDetails = [
    { schoolName: "Smu", major: "Computer science", endTime: "2020-01-27" },
    { schoolName: "Smu", major: "Computer science", endTime: "2020-01-27" },
  ];

  const categoryies = [
    {
      type: "exp",
      keywords: "2 year in java",
    },
    {
      type: "skills",
      keywords: "java,python",
    },
  ];

  const handleReview = (reviewType) => {
    try {
      let postData = {
        id: requestID,
        requestType: reviewType,
        reviewMessage: rejectMsg,
      };
      const data = dispatch(asyncProfessionalReviewOperation(postData));
      // history("-1");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex justify-center">
        <h1 className="font-extrabold text-2xl">{customerType} Details</h1>
      </div>
      <div className="flex flex-col">
        <div className="flex-shrink-0">
          {customerType == "Professional" ? (
            <FaUserTie className="h-12 w-14" />
          ) : (
            <BsBank className="h-12 w-14" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold m-3">{userData?.username}</h3>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="flex flex-row text-base font-medium ">
            <h5 className="mr-3">{userData?.firstname}</h5>
            <h5>{userData?.lastname}</h5>
          </div>
          <div className="text-gray-400 text-sm mt-1">
            <h5>{userData?.address}</h5>
          </div>
        </div>
        <div>
          <div className="flex flex-col mr-12 text-sm text-gray-600 font-normal">
            <div className="flex flex-row">
              <IoIosMail />
              <text className="ml-2"> {userData?.email}</text>{" "}
            </div>
            <div className="flex flex-row mt-2">
              <FaPhoneAlt />
              <p className="ml-2">{userData?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      {customerType == "Professional" && (
        <div className="w-fit h-fit mt-6">
          <h3>Education:</h3>
          {userData?.education && (
            <EducationList educationDetails={userData?.education} />
          )}
          <h3>Categories:</h3>
          {userData?.qualification && (
            <CategoryList Lists={userData?.qualification} />
          )}
        </div>
      )}
      {operationType == "review" && (
        <div className="w-[500px]  mt-5">
          <textarea
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write the reasons for rejection"
            value={rejectMsg}
            onChange={(e) => setRejectMsg(e.target.value)}
          ></textarea>
          <div className="flex justify-between flex-row mt-2">
            <button
              type="button"
              className="bg-accept w-32 text-white px-4 py-2 text-sm rounded hover:bg-green-600"
              onClick={() => handleReview(USERREQUESTTYPE.accountAccepted)}
            >
              Accept
            </button>
            <button
              type="button"
              className=" text-white bg-red-700 w-32 hover:bg-red-800  focus:ring-red-300 rounded text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => handleReview(USERREQUESTTYPE.accountRejected)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
      {operationType == "list" && (
        <div className="w-fit mt-4">
          PaymentHistory:
          <PaymentHistory />
          {customerType == "Professional" && <ProfessionalJobListingPage />}
        </div>
      )}
    </div>
  );
};

export default FullProfileDetails;
