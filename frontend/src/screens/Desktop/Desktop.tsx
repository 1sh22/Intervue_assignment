import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const Desktop = (): JSX.Element => {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >("student");

  const roles = [
    {
      id: "student",
      title: "I'm a Student",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    },
    {
      id: "teacher",
      title: "I'm a Teacher",
      description: "Submit answers and view live poll results in real-time.",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white w-full max-w-[1440px] relative py-16">
        <div className="flex flex-col items-center">
          {/* Badge */}
          <Badge className="flex items-center gap-[7px] px-[9px] py-2 rounded-3xl bg-[linear-gradient(90deg,rgba(117,101,217,1)_0%,rgba(77,10,205,1)_100%)] border-none mb-10">
            <img
              className="w-[14.66px] h-[14.65px]"
              alt="Vector"
              src="/vector.svg"
            />
            <span className="font-['Sora',Helvetica] font-semibold text-white text-sm">
              Intervue Poll
            </span>
          </Badge>

          {/* Heading */}
          <div className="flex flex-col items-center max-w-[737px] gap-[5px] mb-16">
            <h1 className="font-['Sora',Helvetica] text-[40px] text-center tracking-[0] leading-normal mt-[-1px]">
              <span className="font-normal">Welcome to the </span>
              <span className="font-semibold">Live Polling System</span>
            </h1>
            <p className="font-['Sora',Helvetica] font-normal text-[#00000080] text-[19px] text-center tracking-[0] leading-normal">
              Please select the role that best describes you to begin using the
              live polling system
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`w-[387px] cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? "border-none shadow-md"
                    : "border border-solid border-[#d9d9d9]"
                }`}
                onClick={() =>
                  setSelectedRole(role.id as "student" | "teacher")
                }
              >
                <CardContent className="flex flex-col items-start justify-center gap-[17px] p-[25px_17px_15px_25px]">
                  <div className="flex flex-col items-start justify-center gap-[9px]">
                    <div className="flex items-end justify-center gap-[11px]">
                      <h2 className="font-['Sora',Helvetica] font-semibold text-black text-[23px] tracking-[0] leading-normal whitespace-nowrap mt-[-1px]">
                        {role.title}
                      </h2>
                    </div>
                  </div>
                  <p className="font-['Sora',Helvetica] font-normal text-[#454545] text-base tracking-[0] leading-normal">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          <Button className="w-[234px] h-[58px] rounded-[34px] bg-[linear-gradient(159deg,rgba(143,100,225,1)_0%,rgba(29,104,189,1)_100%)] border-none">
            <span className="font-['Sora',Helvetica] font-semibold text-white text-lg">
              Continue
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
