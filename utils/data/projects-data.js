export const projectsData = [
  {
    id: 1,
    name: 'TruthScan',
    description:
      "An AI-powered fake news detection platform built with React, Express, and Flask ML microservices. Trained and deployed a TF-IDF + Logistic Regression model on 44,000+ news articles achieving 94.2% accuracy. Features dual-mode detection using ML classification and sensationalism scoring for headlines, along with confidence analysis and signal breakdown.",
    tools: ['React', 'Node.js', 'Express', 'Flask', 'Scikit-learn', 'Tailwind CSS'],
    role: 'Full Stack Developer',
    image: '/image/truthscan.png',
    code: 'https://github.com/sohampatel03',
    demo: 'https://fake-news-detection-ml-kohl.vercel.app/',
  },
  {
    id: 2,
    name: 'MindVault',
    description:
      "An AI-powered study platform that generates quizzes from text and handwritten notes using Gemini AI. Integrated OCR pipelines using FastAPI, Tesseract OCR, EasyOCR, and OpenCV for text extraction. Built with secure MERN architecture featuring JWT authentication, quiz analytics, timers, and Cloudinary media storage.",
    tools: ['MongoDB', 'Express', 'React', 'Node.js', 'FastAPI', 'Gemini AI', 'OCR', 'Cloudinary', 'JWT'],
    role: 'Full Stack Developer',
    image: '/image/mindvault.png',
    code: 'https://github.com/sohampatel03',
    demo: 'https://mind-vault-green.vercel.app/',
  },
  {
    id: 3,
    name: 'Study Planner with AI',
    description:
      "An AI-integrated study planner with task management, calendar scheduling, and timer-based progress tracking. Integrated Gemini AI to generate enhanced task descriptions and personalized study recommendations. Features JWT authentication, MongoDB-based user data isolation, animated progress tracking, and is deployed on Vercel, Render, and MongoDB Atlas.",
    tools: ['MongoDB', 'Express', 'React', 'Node.js', 'Gemini API', 'JWT', 'Tailwind CSS'],
    role: 'Full Stack Developer',
    image: '/image/studyplanner.png',
    code: 'https://github.com/sohampatel03',
    demo: 'https://study-planner-with-ai.vercel.app/',
  },
];