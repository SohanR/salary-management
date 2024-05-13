import argon2 from "argon2";
import { verifyUser } from "../middleware/AuthUser.js";
import EmployeeModel from "../models/employeeModel.js";

export const Login = async (req, res) => {
  let user = {};
  try {
    const employee = await EmployeeModel.findOne({
      username: req.body.username,
    });

    if (!employee) {
      return res.status(404).json({ msg: "Employee data not found" });
    }

    const match = await argon2.verify(employee.password, req.body.password);

    if (!match) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    req.session.userId = employee.employeeId;

    user = {
      id_employee: employee._id,
      employee_name: employee.employeeName,
      username: employee.username,
      access_rights: employee.accessRights,
    };

    res.status(200).json({
      id_employee: user.id_employee,
      employee_name: user.employee_name,
      username: user.username,
      access_rights: user.access_rights,
      msg: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "You must be logged in" });
  }

  const employee = await EmployeeModel.findOne(
    { employeeId: req.session.userId },
    { nid: 1, employeeName: 1, username: 1, accessRights: 1, _id: 0 }
  );

  if (!employee) return res.status(404).json({ msg: "User not found" });

  return res.status(200).json(employee);
};

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Unable to logout" });
    res.status(200).json({ msg: "You have been logged out" });
  });
};

export const changePassword = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;

  const user = await EmployeeModel.findById(userId);

  if (!user) return res.status(401).json({ msg: "User not found" });

  const { password, confPassword } = req.body;

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });

  try {
    const hashPassword = await argon2.hash(password);

    await EmployeeModel.findByIdAndUpdate(userId, {
      password: hashPassword,
    });
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
