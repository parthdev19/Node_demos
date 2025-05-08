import jwt from "jsonwebtoken";

interface IUser {
  _id: string;
}

const userToken = async (findUser: IUser): Promise<string> => {
  const token = jwt.sign(
    { id: findUser._id },
    process.env.USER_TOKEN_KEY as string
  );
  return token;
};

const adminToken = async (findUser: IUser): Promise<string> => {
  const token = jwt.sign(
    { id: findUser._id },
    process.env.ADMIN_TOKEN_KEY as string
  );
  return token;
};

export { userToken, adminToken };
