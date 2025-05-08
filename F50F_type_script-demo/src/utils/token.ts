import jwt from "jsonwebtoken";

interface IUser {
  _id: string;
}

const userToken = async (findCustomer: IUser): Promise<string> => {
  const token = jwt.sign({ id: findCustomer._id }, process.env.TOKEN_KEY as string);
  return token;
};

export { userToken };
