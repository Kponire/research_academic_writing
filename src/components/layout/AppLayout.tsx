import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  Text,
  Avatar,
  ActionIcon,
  Menu,
  Tooltip,
  Divider,
  Indicator,
} from "@mantine/core";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  RiDashboardLine,
  RiFolder2Line,
  RiGroupLine,
  RiSendPlaneLine,
  RiCompassLine,
  RiMessage2Line,
  RiBarChartLine,
  RiSettingsLine,
  RiNotification3Line,
  RiSearchLine,
  RiMagicLine,
  RiLogoutBoxLine,
  RiUserLine,
  RiQuestionLine,
} from "react-icons/ri";
import { mockUser } from "../../data/mockData";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { path: "/dashboard/", label: "Dashboard", icon: RiDashboardLine },
      {
        path: "/dashboard/generate",
        label: "Generate Paper",
        icon: RiMagicLine,
        badge: "AI",
      },
      { path: "/dashboard/papers", label: "My Papers", icon: RiFolder2Line },
    ],
  },
  {
    label: "Collaboration",
    items: [
      {
        path: "/dashboard/collaborations",
        label: "Collaborations",
        icon: RiGroupLine,
      },
      {
        path: "/dashboard/submissions",
        label: "Journal Submissions",
        icon: RiSendPlaneLine,
      },
      {
        path: "/dashboard/discover",
        label: "Discover Journals",
        icon: RiCompassLine,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      { path: "/dashboard/reviews", label: "Reviews", icon: RiMessage2Line },
      {
        path: "/dashboard/analytics",
        label: "Analytics",
        icon: RiBarChartLine,
      },
      /* {
        path: "/dashboard/achievements",
        label: "Achievements",
        icon: RiTrophyLine,
      }, */
    ],
  },
  {
    label: "Account",
    items: [
      { path: "/dashboard/settings", label: "Settings", icon: RiSettingsLine },
    ],
  },
];
// { children }: { children: React.ReactNode }

export default function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <AppShell
      padding={0}
      header={{ height: 68 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      {/* ============ HEADER ============ */}
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          style={{
            background: "var(--sidebar-bg)",
            //borderBottom: "1px solid var(--neutral-150)",
          }}
        >
          {/* Left: Burger + Logo */}
          <Group gap={12}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="var(--neutral-600)"
            />
            <Group
              gap={8}
              style={{ cursor: "pointer" }}
              onClick={() => handleNav("/")}
            >
              {/*               <div
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RiSparklingLine size={17} color="#fff" />
              </div> */}
              <Text
                fw={900}
                size="20px"
                style={{
                  wordSpacing: "0.5em",
                  color: "#fff",
                }}
                visibleFrom="xs"
              >
                Scholars
                <span
                  style={{ paddingLeft: "0.2em", color: "var(--color-700)" }}
                >
                  AI
                </span>
              </Text>
            </Group>
          </Group>

          {/* Center: Search */}
          <Group
            gap={8}
            style={{
              flex: 1,
              maxWidth: 380,
              margin: "0 24px",
              background: "var(--neutral-100)",
              borderRadius: "10px",
              border: "1.5px solid var(--neutral-150)",
              padding: "8px 14px",
              cursor: "pointer",
            }}
            visibleFrom="sm"
            onClick={() => setSearchOpen(true)}
          >
            <RiSearchLine size={15} color="var(--neutral-400)" />
            <Text size="13px" c="var(--neutral-400)" fw={500}>
              Search papers, journals...
            </Text>
            <Text
              size="11px"
              c="var(--neutral-300)"
              fw={600}
              ml="auto"
              style={{
                background: "var(--neutral-200)",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              ⌘K
            </Text>
          </Group>

          {/* Right: Actions */}
          <Group gap={6}>
            <Tooltip label="Notifications" position="bottom">
              <Indicator color="var(--color-600)" size={8} offset={3}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  radius="md"
                  style={{ color: "#fff" }}
                >
                  <RiNotification3Line size={19} />
                </ActionIcon>
              </Indicator>
            </Tooltip>

            <Menu width={200} position="bottom-end" shadow="lg" radius="md">
              <Menu.Target>
                <Group
                  gap={8}
                  style={{
                    cursor: "pointer",
                    padding: "5px 8px",
                    borderRadius: "10px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--neutral-100)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Avatar
                    size={32}
                    radius="xl"
                    style={{
                      background: "var(--color-700)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}
                  >
                    {mockUser.initials}
                  </Avatar>
                  <div style={{ display: "none" }}>
                    <Text
                      size="13px"
                      fw={700}
                      lh={1.2}
                      style={{ color: "var(--neutral-800)" }}
                    >
                      {mockUser.name.split(" ")[0]}
                    </Text>
                    <Text size="11px" c="var(--neutral-400)" fw={500}>
                      {mockUser.plan} Plan
                    </Text>
                  </div>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<RiUserLine size={14} />}
                  onClick={() => handleNav("/settings")}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<RiSettingsLine size={14} />}
                  onClick={() => handleNav("/settings")}
                >
                  Settings
                </Menu.Item>
                <Menu.Item leftSection={<RiQuestionLine size={14} />}>
                  Help & Support
                </Menu.Item>
                <Divider />
                <Menu.Item
                  leftSection={<RiLogoutBoxLine size={14} />}
                  color="red"
                >
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ============ SIDEBAR ============ */}
      <AppShell.Navbar>
        <div
          style={{
            height: "100%",
            background: "var(--sidebar-bg)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Navigation */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px 16px" }}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <div className="sidebar-section-label">{section.label}</div>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      className={`sidebar-nav-link ${isActive ? "active" : ""}`}
                      onClick={() => handleNav(item.path)}
                    >
                      <Icon className="nav-icon" size={17} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 900,
                            padding: "2px 6px",
                            background: "rgba(201,24,74,0.25)",
                            color: "#ff758f",
                            borderRadius: "4px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div
            style={{
              margin: "8px 10px 12px",
              background: "rgba(201,24,74,0.12)",
              border: "1px solid rgba(201,24,74,0.2)",
              borderRadius: "10px",
              padding: "12px 14px",
            }}
          >
            <Text
              size="11.5px"
              fw={800}
              style={{ color: "#fff", marginBottom: "3px" }}
            >
              {" "}
              Upgrade to Team
            </Text>
            <Text
              size="11px"
              style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}
            >
              Collaborate with unlimited researchers
            </Text>
            <button
              style={{
                marginTop: "10px",
                width: "100%",
                background: "var(--color-600)",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                padding: "7px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-700)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-600)")
              }
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </AppShell.Navbar>

      {/* ============ MAIN ============ */}
      <AppShell.Main style={{ background: "var(--neutral-50)" }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
