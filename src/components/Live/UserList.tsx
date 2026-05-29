import type { UserDataType } from "../../features/live/types/userTypes";
import { IconButton } from "../Button";
import Flexbox from "../Flexbox";
import { AppConfirm } from "../../libs/dialog/AppConfirm";

import { kickUser } from "../../features/live/api/userApi";

import { useToast } from "../Toast";
import { useParams } from "react-router-dom";

const UserList = ({ users }: { users: UserDataType[] }) => {
  const { showToast } = useToast();
  const { eventId } = useParams();

  if (users.length === 0 || !users) return <p>ユーザーがいません</p>;

  return (
    <ul className="p-userList">
      {users.map((user: UserDataType) => {
        return (
          <li
            key={user.userId}
            style={{
              borderBottom: ".1rem solid var(--c-active)",
              padding: "0.5em 1em",
            }}
          >
            <Flexbox>
              <p className="p-userList__userName">
                {user.userName || "ゲストさん"}
              </p>
              <IconButton
                variant="ghost"
                className="u-mrgn--left-auto"
                onClick={async () => {
                  try {
                    const confirm = await AppConfirm({
                      title: `${user.userName || "ゲスト"}さんをイベントから削除しますか`,
                      confirmText: "削除する",
                    });

                    if (!confirm) return;

                    await kickUser(eventId || "", user.userId);
                    showToast({
                      title: `${user.userName || "ゲスト"}さんを削除しました`,
                    });
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                delete
              </IconButton>
            </Flexbox>
          </li>
        );
      })}
    </ul>
  );
};

export { UserList };
