export const ConnectToDB = (db) => {
  const connectDB = `http://api.tooskaweb.com/api/${db}`;

  return connectDB;
};
