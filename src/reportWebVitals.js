import { onCLS, onFID, onLCP } from 'web-vitals';

const reportWebVitals = (metric) => {
  console.log(metric);
};

// Use the on-prefixed versions of the web vitals functions
onCLS(reportWebVitals);
onFID(reportWebVitals);
onLCP(reportWebVitals);

export default reportWebVitals;
