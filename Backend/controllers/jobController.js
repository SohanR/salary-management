// Display all job data
export const getJobData = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await JobModel.find({})
        .populate({
          path: "userId",
          select: "employeeName username role",
        })
        .select(
          "job_id job_title basic_salary transportation_allowance meal_allowance"
        );
    } else {
      const userId = req.userId;
      const userJobs = await JobModel.find({ userId });
      if (!userJobs) return res.status(403).json({ msg: "Forbidden access" });

      response = userJobs;
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get job data by ID
export const getJobDataByID = async (req, res) => {
  try {
    const response = await JobModel.findById(req.params.id).select(
      "job_id job_title basic_salary transportation_allowance meal_allowance"
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ msg: "Job data with the specified ID not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create new job data
export const createJobData = async (req, res) => {
  const {
    job_id,
    job_title,
    basic_salary,
    transportation_allowance,
    meal_allowance,
  } = req.body;

  try {
    if (req.role === "admin") {
      const newJob = new JobModel({
        job_id,
        job_title,
        basic_salary,
        transportation_allowance,
        meal_allowance,
        userId: req.userId,
      });
      await newJob.save();
      res
        .status(201)
        .json({ success: true, message: "Job data successfully saved" });
    } else {
      res.status(403).json({ msg: "Forbidden access" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update job data
export const updateJobData = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Data not found" });

    const {
      job_title,
      basic_salary,
      transportation_allowance,
      meal_allowance,
    } = req.body;

    if (req.role === "admin") {
      job.job_title = job_title;
      job.basic_salary = basic_salary;
      job.transportation_allowance = transportation_allowance;
      job.meal_allowance = meal_allowance;
      await job.save();
    } else {
      if (req.userId !== job.userId.toString())
        return res.status(403).json({ msg: "Forbidden access" });
      job.job_title = job_title;
      job.basic_salary = basic_salary;
      job.transportation_allowance = transportation_allowance;
      job.meal_allowance = meal_allowance;
      await job.save();
    }
    res.status(200).json({ msg: "Job data successfully updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete job data
export const deleteJobData = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Data not found" });

    if (req.role === "admin") {
      await job.remove();
    } else {
      if (req.userId !== job.userId.toString())
        return res.status(403).json({ msg: "Forbidden access" });
      await job.remove();
    }
    res.status(200).json({ msg: "Job data successfully deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
