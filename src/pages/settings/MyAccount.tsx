import { FaPencil, FaUser } from "react-icons/fa6";
import { useUserContext } from "../../utils/UserContext.tsx";
import { LabelInput } from "../../components/form/LabelInput.tsx";
import { AiTwotoneMail } from "react-icons/ai";

export const MyAccount = () => {
  const { user } = useUserContext();
  if (!user) return;
  return (
    <div className={"w-full h-full flex flex-col gap-4"}>
      <h2 className={"flex flex-row gap-2 items-center"}>
        <FaUser /> My Account
      </h2>
      <div className={"flex flex-col gap-2"}>
        <h2>Account Information</h2>
        <div className={"flex flex-col gap-2"}>
          <LabelInput
            placeholder={"E-mail"}
            defaultValue={user.email}
            icon={<AiTwotoneMail />}
          />
        </div>
      </div>
      <div className={"flex flex-col gap-2"}>
        <h2>Profile Information</h2>
        <div className={"flex flex-col gap-2"}>
          <LabelInput
            placeholder={"Username"}
            defaultValue={user.name}
            icon={<FaPencil />}
          />
        </div>
      </div>
    </div>
  );
};
