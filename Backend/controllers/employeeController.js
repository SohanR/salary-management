import EmployeeModel from "../models/employeeModel";

export const getEmployeeData = async (req, res) => {
  try {
    const res = await EmployeeModel.find(
      {},
      {
        _id: 1,
        nid: 1,
        employeeName: 1,
        employeeId: 1,
        gender: 1,
        jobTitle: 1,
        joinDate: 1,
        status: 1,
        photo: 1,
        accessRights: 1,
      }
    );

    res.status(200).json(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeDataByID = async (req, res) => {
  try {
    const response = await EmployeeModel.findOne(
      { _id: req.params.id },
      {
        _id: 1,
        nid: 1,
        employeeName: 1,
        gender: 1,
        jobTitle: 1,
        username: 1,
        joinDate: 1,
        status: 1,
        photo: 1,
        accessRights: 1,
      }
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res
        .status(404)
        .json({ msg: "Employee data with the given ID was not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get employee data by NID
export const getEmployeeDataByNid = async (req, res) => {
  try {
    const response = await EmployeeModel.findOne(
      { nid: req.params.nik },
      {
        _id: 1,
        nid: 1,
        employeeName: 1,
        gender: 1,
        jobTitle: 1,
        joinDate: 1,
        status: 1,
        photo: 1,
        accessRights: 1,
      }
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res
        .status(404)
        .json({ msg: "Employee data with the given NID was not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get employee data by name
export const getEmployeeDataByName = async (req, res) => {
  try {
    const response = await EmployeeModel.findOne(
      { employeeName: req.params.name },
      {
        _id: 1,
        nid: 1,
        employeeName: 1,
        gender: 1,
        jobTitle: 1,
        joinDate: 1,
        status: 1,
        photo: 1,
        accessRights: 1,
      }
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res
        .status(404)
        .json({ msg: "Employee data with the given name was not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create employee data
export const createEmployeeData = async (req, res) => {
  const {
    nid,
    employeeName,
    username,
    password,
    confPassword,
    gender,
    jobTitle,
    joinDate,
    status,
    accessRights,
  } = req.body;

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirmation Password do not match" });
  }

  if (!req.files || !req.files.photo) {
    return res
      .status(400)
      .json({ msg: "Failed to upload photo. Please upload the photo again" });
  }

  const file = req.files.photo;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedTypes = [".png", ".jpg", ".jpeg"];

  if (!allowedTypes.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: "Photo file format is not supported" });
  }

  if (fileSize > 2000000) {
    return res.status(422).json({ msg: "Image size must be less than 2 MB" });
  }

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }

    const hashPassword = await argon2.hash(password);

    try {
      await EmployeeModel.create({
        nid: nid,
        employeeName: employeeName,
        username: username,
        password: hashPassword,
        gender: gender,
        jobTitle: jobTitle,
        joinDate: joinDate,
        status: status,
        photo: fileName,
        url: url,
        accessRights: accessRights,
      });

      res
        .status(201)
        .json({ success: true, message: "Registration Successful" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

// Method to update employee data
export const updateEmployeeData = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);

    if (!employee)
      return res.status(404).json({ msg: "Employee data not found" });

    const {
      nid,
      employeeName,
      username,
      gender,
      jobTitle,
      joinDate,
      status,
      accessRights,
    } = req.body;

    employee.nid = nid;
    employee.employeeName = employeeName;
    employee.username = username;
    employee.gender = gender;
    employee.jobTitle = jobTitle;
    employee.joinDate = joinDate;
    employee.status = status;
    employee.accessRights = accessRights;

    await employee.save();

    res.status(200).json({ msg: "Employee data successfully updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Method to update employee password
export const changePasswordAdmin = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);

    if (!employee)
      return res.status(404).json({ msg: "Employee data not found" });

    const { password, confPassword } = req.body;

    if (password !== confPassword)
      return res
        .status(400)
        .json({ msg: "Password and Confirmation Password do not match" });

    if (employee.accessRights === "pegawai") {
      const hashPassword = await argon2.hash(password);

      employee.password = hashPassword;

      await employee.save();

      res.status(200).json({ msg: "Employee password successfully updated" });
    } else {
      res.status(403).json({ msg: "Forbidden" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Method to delete employee data
export const deleteEmployeeData = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);

    if (!employee)
      return res.status(404).json({ msg: "Employee data not found" });

    await employee.remove();

    res.status(200).json({ msg: "Employee data successfully deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
