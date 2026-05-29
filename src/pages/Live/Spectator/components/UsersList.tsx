import type { UserDataType } from "../../../../features/live/types/userTypes";
import Flexbox from "../../../../components/Flexbox";
import { Icon } from "../../../../components/Icon";
import type { CSSProperties } from "react";

const UsersList = ({ users }: { users: UserDataType[] }) => {
  return (
    <ul className="p-usersList">
      {users
        .sort((a, b) => b.score - a.score)
        .map((user: UserDataType, index: number) => {
          return (
            <li key={user.userId} className="p-usersList__item">
              <Flexbox>
                <Icon
                  variant="ghost"
                  style={
                    {
                      "--sz-icon": "5.2rem",
                    } as CSSProperties
                  }
                >
                  {index === 0 ? "crown" : "person"}
                </Icon>
                <p>{user.userName || "ゲストさん"}</p>
              </Flexbox>
            </li>
          );
        })}
    </ul>
  );
};

export default UsersList;
