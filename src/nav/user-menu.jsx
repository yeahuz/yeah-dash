import { useContext, useState } from "preact/hooks";
import { AuthContext } from "../auth/state.jsx";
import {
  EuiHeaderSectionItemButton,
  EuiAvatar,
  EuiPopover,
  useGeneratedHtmlId,
  EuiContextMenu
} from "@elastic/eui";
import { useTranslation } from "react-i18next";
import { LogoutModal } from "../auth/logout-modal.jsx";


export function UserMenu() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: "headerUserPopover",
  });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const panels = [
    {
      id: 0,
      title: user.name,
      items: [
        {
          name: t("logout", { ns: "auth" }),
          icon: "push",
          onClick: () => setLogoutModalOpen(true)
        }
      ]
    }
  ]

  const button = (
    <EuiHeaderSectionItemButton
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={() => setIsOpen(prev => !prev)}
    >
      <EuiAvatar name={user.name} imageUrl="http%3A%2F%2Flocalhost%3A3001%2Favatars%3Fname%3DAvazbek%20Juraev" size="s" />
    </EuiHeaderSectionItemButton>
  );

  return (
    <>
      <EuiPopover
        id={headerUserPopoverId}
        button={button}
        isOpen={isOpen}
        anchorPosition="downRight"
        closePopover={() => setIsOpen(false)}
        panelPaddingSize="none"
      >
        <EuiContextMenu initialPanelId={0} panels={panels} />
      </EuiPopover>
      {logoutModalOpen ? <LogoutModal onCancel={() => setLogoutModalOpen(false)} /> : null}
    </>
  );
};
