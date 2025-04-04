import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ThreeDBackground from '../components/ThreeDBackground';
import ThreeDJobCard from '../components/ThreeDJobCard';
import { motion } from 'framer-motion';

const JobList3D = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, 'jobs');
        const jobSnapshot = await getDocs(jobsCollection);
        const jobList = jobSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 3D animated background */}
      <ThreeDBackground />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            3D Job Board Experience
          </h1>
          
          <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
            Explore job opportunities in an immersive 3D environment. Click on a job card to view details and apply.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <ThreeDJobCard job={job} onClick={() => handleJobClick(job)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Job details modal */}
      {selectedJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeJobDetails}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h2>
                <p className="text-lg text-gray-600">{selectedJob.company}</p>
              </div>
              <button
                onClick={closeJobDetails}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedJob.location || 'Remote'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium text-green-600">{selectedJob.salary || 'Competitive'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium">{selectedJob.type || 'Full-time'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-medium">{selectedJob.postedDate || 'Recently'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {selectedJob.requirements ? (
                  selectedJob.requirements.map((req, index) => (
                    <li key={index} className="mb-1">{req}</li>
                  ))
                ) : (
                  <li>No specific requirements listed</li>
                )}
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleApply(selectedJob.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JobList3D;