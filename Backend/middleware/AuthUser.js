// export const verifyUser = async (req, res, next) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ msg: "Mohon Login ke Akun Anda!" });
//   }
//   try {
//     const pegawai = await DataPegawai.findOne({
//       where: {
//         id_pegawai: req.session.userId,
//       },
//     });
//     if (!pegawai) return res.status(404).json({ msg: "User Tidak di Temukan" });
//     req.userId = pegawai.id;
//     req.hak_akses = pegawai.hak_akses;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: "Terjadi Kesalahan Pada Server" });
//   }
// };

// export const adminOnly = async (req, res, next) => {
//   try {
//     const pegawai = await DataPegawai.findOne({
//       where: {
//         id_pegawai: req.session.userId,
//       },
//     });
//     if (!pegawai)
//       return res.status(404).json({ msg: "Data Pegawai Tidak di Temukan" });
//     if (pegawai.hak_akses !== "admin")
//       return res.status(403).json({ msg: "Akses terlarang" });
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: "Terjadi Kesalahan Pada Server" });
//   }
// };

import EmployeeModel from "../models/EmployeeModel";
export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please log in to your account!" });
  }
  try {
    const employee = await EmployeeModel.findOne({
      _id: req.session.userId,
    });
    if (!employee) return res.status(404).json({ msg: "User not found" });
    req.userId = employee._id;
    req.role = employee.role;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOne({
      _id: req.session.userId,
    });
    if (!employee)
      return res.status(404).json({ msg: "Employee data not found" });
    if (employee.role !== "admin")
      return res.status(403).json({ msg: "Access forbidden" });
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error" });
  }
};
