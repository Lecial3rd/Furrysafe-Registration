import supabase from "../config/database.js";

//REGISTRATION FUNCTIONS

//create buddy in buddy tbl
export const createBuddy = async (userID, user) => {
  try {
    const { data, error } = await supabase
      .from("tbl_buddy")
      .insert([
        { user_id: userID }, // Insert the userID into the buddy table
      ])
      .select(); //retrieve created row/buddy

    if (error) {
      console.error("Error creating buddy:", error);
      throw error;
    } else {
      const buddyid = data[0]?.buddy_id;
      createBuddyDetails(buddyid, user); //create buddy in tbl buddy details
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const createBuddyDetails = async (buddyid, user) => {
  //create buddy in buddy details
  try {
    const { data, error } = await supabase
      .from("tbl_buddy_details")
      .insert([
        {
          buddy_id: buddyid,
          user_name: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          dob: user.dob,
          gender: user.gender,
        },
      ])
      .select(); //retrieve created row in buddy details

    if (error) {
      console.error("Error creating buddy:", error);
    }
  } catch (err) {
    console.log("Create buddy details error: ", err);
  }
};

export const createBuddyReport = async (req, res) => { //create report

  let { _user_id, _post_type, _content, _lat, _long, _address,
      _pet_condition, _pet_category, _other_pet_category, _pet_id } = req.body

  console.log(req.body)

  _pet_category = _pet_category == 'other' ? null : _pet_category
  _content = _content == '' ? null : _content
  _pet_id = (_pet_id == "" || _pet_id == 'null') ? null : _pet_id; 
  _other_pet_category = _other_pet_category == 'null' ? null : _other_pet_category
  _pet_condition = _pet_condition == 'null' ? null : _pet_condition
  const photos = req.files
  let photoUrl = []

  for (const photo of photos) {
      const photoPath = `post_photos/${Date.now()}_${photo.originalname}`;
      const { data: photoUploadData, error: photoUploadError } =
          await supabase.storage
              .from("pets_images") // Ensure this is your correct bucket name
              .upload(photoPath, photo.buffer, {
                  contentType: photo.mimetype,
              });

      if (!photoUploadError) {
          const { data: photoUrlData } = supabase.storage
              .from("pets_images")
              .getPublicUrl(photoPath);
          photoUrl.push(photoUrlData.publicUrl); // Collecting extra photo URLs
      } else {
          console.error("Extra photo upload error:", photoUploadError);
          return res
              .status(500)
              .send({ message: "Failed to upload extra photos." });
      }
  }
  try {
      console.log(req.body)

      const { data, error } = await supabase.rpc("insert_post_with_details", {
          _user_id: _user_id,
          _post_type: _post_type,
          _content: _content,
          _lat: _lat,
          _long: _long,
          _address: _address,
          _pet_condition: _pet_condition,
          _photo_urls: photoUrl,
          _pet_category: _pet_category,
          _other_pet_category: _other_pet_category,
          _pet_id: _pet_id
      })
      if (error) {
          console.error("Database insert error:", error);
          return res
              .status(500)
              .send({ message: "Failed to save post to the database." });
      } else {
          res.status(200).send({ success: true });
      }
  }
  catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).send({ message: err });
  }
}


// export const createBuddyReport = async (req, res) => {
//   //create report

//   let {
//     _user_id,
//     _post_type,
//     _content,
//     _lat,
//     _long,
//     _address,
//     _pet_condition,
//     _pet_category,
//     _other_pet_category,
//     _pet_id,
//   } = req.body;

//   console.log(req.body);

//   _pet_category = _pet_category == "other" ? null : _pet_category;
//   _content = _content == "" ? null : _content;
//   _pet_id = _pet_id == "" || _pet_id == "null" ? null : _pet_id;
//   _other_pet_category =
//     _other_pet_category == "null" ? null : _other_pet_category;
//   _pet_condition = _pet_condition == "null" ? null : _pet_condition;
//   const photos = req.files;
//   let photoUrl = [];

//   for (const photo of photos) {
//     const photoPath = `post_photos/${Date.now()}_${photo.originalname}`;
//     const { data: photoUploadData, error: photoUploadError } =
//       await supabase.storage
//         .from("pets_images") // Ensure this is your correct bucket name
//         .upload(photoPath, photo.buffer, {
//           contentType: photo.mimetype,
//         });

//     if (!photoUploadError) {
//       const { data: photoUrlData } = supabase.storage
//         .from("pets_images")
//         .getPublicUrl(photoPath);
//       photoUrl.push(photoUrlData.publicUrl); // Collecting extra photo URLs
//     } else {
//       console.error("Extra photo upload error:", photoUploadError);
//       return res
//         .status(500)
//         .send({ message: "Failed to upload extra photos." });
//     }
//   }
//   try {
//     console.log(req.body);

//     const reportStatus = "Pending"; // Nov12
//     console.log(req.body,  typeof _pet_id)
//     console.log(req.body, typeof req.body._pet_id);wa


//     return
//     const { data, error } = await supabase.rpc("insert_post_with_details", {
//       _user_id: _user_id,
//       _post_type: _post_type,
//       _content: _content,
//       _lat: _lat,
//       _long: _long,
//       _address: _address,
//       _pet_condition: _pet_condition,
//       _photo_urls: photoUrl,
//       _pet_category: _pet_category,
//       _other_pet_category: _other_pet_category,
//       _pet_id: _pet_id,
//       _report_status: reportStatus, // Nov12
//     });
//     if (error) {
//       console.error("Database insert error:", error);
//       return res
//         .status(500)
//         .send({ message: "Failed to save post to the database." });
//     } else {
//       res.status(200).send({ success: true });
//     }
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     res.status(500).send({ message: err });
//   }
// };
export const retrieveBuddyDetails = async (req, res) => {
  //retrieve buddy details
  const { _id } = req.body;

  console.log("id recieved", _id);
  try {
    const { data, error } = await supabase.rpc("get_buddy_details", {
      user_id_input: _id,
    });
    if (error) {
      return res
        .status(500)
        .send({ message: "Failed to save details to the database." });
    } else {
      res.status(200).send({ success: true, data: data });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send({ message: err });
  }
};
export const updateBuddyDetails = async (req, res) => {
  //update buddy details
  const { _buddy_id, _user_name, _firstname, _lastname, _dob, _gender, _bio } =
    req.body;

  console.log("_oldProfile:", req.body._oldProfile);

  // Log _profile_url and _oldProfile to verify values
  const _profile_url =
    req.body._profile_url == null || req.body._profile_url == "null"
      ? null
      : req.body._profile_url;
  const _oldProfile =
    req.body._oldProfile == null || req.body._oldProfile == "null"
      ? ""
      : req.body._oldProfile;

  console.log("_oldProfile:", _oldProfile);

  const file = req.files;

  if (file && file.length > 0) {
    file.forEach((photo, index) => {
      console.log(`File ${index + 1}:`);
      console.log("Original Name:", photo.originalname);
      console.log("Mimetype:", photo.mimetype);
      console.log("Size:", photo.size);
      console.log("Path:", photo.path);
    });
  } else {
    console.log("No files uploaded");
  }
  let photoUrl = _profile_url;
  console.log(photoUrl);

  if (_oldProfile != null && _oldProfile != "") {
    const prefix = "/storage/v1/object/public/images/user_images/";
    // Extract the file path from the `oldProfile` URL
    const filePath = new URL(_oldProfile).pathname.replace(prefix, "").trim();
    console.log("File path to delete:", filePath);
    const fullFilePath = `user_images/${filePath}`;
    const { error: deleteError } = await supabase.storage
      .from("images")
      .remove([fullFilePath]);

    if (deleteError) {
      console.error("Failed to delete old profile photo:", deleteError);
    } else {
      console.log("Old profile photo deleted successfully");
    }
  }

  for (const photo of file) {
    const photoPath = `user_images/${Date.now()}_${photo.originalname}`;
    const { data: photoUploadData, error: photoUploadError } =
      await supabase.storage
        .from("images") // Ensure this is your correct bucket name
        .upload(photoPath, photo.buffer, {
          contentType: photo.mimetype,
        });

    if (!photoUploadError) {
      const { data: photoUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(photoPath);
      photoUrl = photoUrlData.publicUrl; // Collecting extra photo URLs
    } else {
      console.error("Extra photo upload error:", photoUploadError);
      return res
        .status(500)
        .send({ message: "Failed to upload extra photos." });
    }
  }

  try {
    const { data, error } = await supabase.rpc("update_buddy_details", {
      _buddy_id: _buddy_id,
      _user_name: _user_name,
      _firstname: _firstname,
      _lastname: _lastname,
      _dob: _dob,
      _gender: _gender,
      _bio: _bio,
      _profile_url: photoUrl,
    });
    if (error) {
      console.error("Database insert error:", error);
      return res
        .status(500)
        .send({ message: "Failed to save details to the database." });
    } else {
      res.status(200).send({ success: true });
    }
  } catch (err) {
    res.status(200).send({ success: false, message: err });
  }
};
export const retrieveBuddyPost = async (req, res) => {
  const { _id } = req.body;

  try {
    const { data, error } = await supabase.rpc("get_post_details_with_photos", {
      _id: _id,
    });
    if (error) {
      console.error("Database insert error:", error);
      res.status(500).send({
        success: false,
        message: "Failed to retrieve posts",
        data: error,
      });
    } else {
      res.status(200).send({ success: true, data: data });
    }
  } catch (err) {
    console.error("Database insert error:", err);
  }
};

export default createBuddy;
