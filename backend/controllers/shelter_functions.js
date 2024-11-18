import {
  addShelterAddress,
  retrieveShelterDetails,
  saveShelter_and_Link,
  retrieveProfile,
  retrievePetProfile,
  retrievePetBreed,
  retrieveVaccineCategory,
  retrieveSterilization,
  retrievePetStatus,
  savepetprofie,
  updatepetprofile,
  searchUser,
  loadInbox,
  sendMessage,
  getFullName,
  createNewChat,
  getAllShelters, //added getAllShelters from salpocial's code
  retrieveReports,
  retrieveEvents,
  addShelterPost, //Nov5 added addShelterPost, acceptRescueReport, addShelterEvent from salpocial's code
  acceptRescueReport,
  addShelterEvent,
  getOngoingOperations,
  getRescuedHistory,
  confirmRescue,
  cancelOperation
} from "../model/shelterFunctionsModel.js";

export const insertShelterAddress = (req, res) => {
  addShelterAddress(req, res);
};
export const getShelterDetails = (req, res) => {
  retrieveShelterDetails(req, res);
};
export const insertShelterLink = (req, res) => {
  saveShelter_and_Link(req, res);
};
export const getProfile = (req, res) => {
  retrieveProfile(req, res);
};
export const getPetProfile = (req, res) => {
  retrievePetProfile(req, res);
};
export const getPetBreed = (req, res) => {
  retrievePetBreed(req, res);
};
export const getVaccineCategory = (req, res) => {
  retrieveVaccineCategory(req, res);
};
export const getSterilization = (req, res) => {
  retrieveSterilization(req, res);
};
export const getPetStatus = (req, res) => {
  retrievePetStatus(req, res);
};
export const insertPetProfile = (req, res) => {
  savepetprofie(req, res);
};
export const updatePetProfile = (req, res) => {
  updatepetprofile(req, res);
};
export const searchUserName = (req, res) => {
  searchUser(req, res);
};
export const loadInboxMessages = (req, res) => {
  loadInbox(req, res);
};
export const insertMessage = (req, res) => {
  sendMessage(req, res);
};
export const getUserFullName = (req, res) => {
  getFullName(req, res);
};
export const insertNewChat = (req, res) => {
  createNewChat(req, res);
};
export const fetchAllShelters = (req, res) => {
  getAllShelters(req, res);
};
export const getReports = (req, res) => {
  retrieveReports(req, res);
};

// Nov5 start of salpocial's new code
// Function for shelter create new post
export const insertShelterPost = (req, res) => {
  ``
  addShelterPost(req, res);
};

// Function for shelter create new post
export const insertShelterEvent = (req, res) => {
  addShelterEvent(req, res);
};

// In progresss Shelter Rescue Operations
export const insertShelterRescue = (req, res) => {
  acceptRescueReport(req, res);
};
// Nov5 end of salpocial's new codeexport 
export const getEvents = (req, res) => {
  retrieveEvents(req, res);
};
export const getongoingoperation = (req, res) => {
  getOngoingOperations(req, res); 
};
export const getrescuedhistory = (req, res) => {
  getRescuedHistory(req, res); 
};
export const setConfirmRescued = (req, res) => {
  confirmRescue(req, res);
};
export const setCancelOperation = (req, res) => {
  cancelOperation(req, res);
};
