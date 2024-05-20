import AttendanceModel from "../models/attendanceModel";
import EmployeeModel from "../models/employeeModel";

// Method for employee dashboard
export const employeeDashboard = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;

  const response = await EmployeeModel.findOne(
    {
      _id: userId,
    },
    {
      _id: 1,
      nik: 1,
      employeeName: 1,
      gender: 1,
      jobTitle: 1,
      joinDate: 1,
      status: 1,
      photo: 1,
      accessRights: 1,
    }
  );

  res.status(200).json(response);
};

// Method to view single employee salary by month
export const viewSingleEmployeeSalaryByMonth = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await EmployeeModel.findById(userId);

  try {
    const employeeSalaryData = await getEmployeeSalaryData();

    const response = await AttendanceModel.findOne({
      month: req.params.month,
    });

    if (response) {
      const salaryByMonth = employeeSalaryData
        .filter((salary) => {
          return (
            salary.employeeId === userId && salary.month === response.month
          );
        })
        .map((salary) => {
          return {
            month: response.month,
            year: salary.year,
            nid: user.nid,
            employeeName: user.employeeName,
            gender: user.gender,
            jobTitle: user.jobTitle,
            basicSalary: salary.basicSalary,
            transportAllowance: salary.transportAllowance,
            mealAllowance: salary.mealAllowance,
            deductions: salary.deductions,
            totalSalary: salary.total,
          };
        });
      return res.json(salaryByMonth);
    }

    res.status(404).json({
      msg: `Salary data for the month of ${req.params.month} was not found for employee ${user.employeeName}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Method to view single employee salary by year
export const viewSingleEmployeeSalaryByYear = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await EmployeeModel.findById(userId);

  try {
    const employeeSalaryData = await getEmployeeSalaryData();
    const { year } = req.params;

    const salaryByYear = employeeSalaryData
      .filter((salary) => {
        return salary.employeeId === userId && salary.year === parseInt(year);
      })
      .map((salary) => {
        return {
          year: salary.year,
          month: salary.month,
          nik: user.nik,
          employeeName: user.employeeName,
          gender: user.gender,
          jobTitle: user.jobTitle,
          basicSalary: salary.basicSalary,
          transportAllowance: salary.transportAllowance,
          mealAllowance: salary.mealAllowance,
          deductions: salary.deductions,
          totalSalary: salary.total,
        };
      });

    if (salaryByYear.length === 0) {
      return res
        .status(404)
        .json({ msg: `Data for the year ${year} was not found` });
    }
    res.json(salaryByYear);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Data displayed: ( Month / Year, Basic Salary, Transport Allowance, Meal Allowance, Deductions, Total Salary )
