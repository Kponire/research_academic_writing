import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Text,
  Group,
  Modal,
  ActionIcon,
  Menu,
  Tabs,
  TextInput,
  Select,
  Stack,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import {
  RiAddLine,
  RiSearchLine,
  RiMoreLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiMailSendLine,
  RiCheckLine,
  RiTimeLine,
  RiFileTextLine,
} from "react-icons/ri";
import { mockCollaborators, mockPapers } from "../data/mockData";
import { notifications } from "@mantine/notifications";
import { FaRegUserCircle } from "react-icons/fa";

const ROLES = ["Co-Author", "Reviewer", "Advisor", "Observer"];
const PERMISSIONS = {
  "Co-Author": ["View", "Edit", "Comment", "Generate"],
  Reviewer: ["View", "Comment"],
  Advisor: ["View", "Comment", "Approve"],
  Observer: ["View"],
};

function CollaboratorCard({ collab, onRemove }: any) {
  return (
    <div
      className="section-card"
      style={{ transition: "all 0.2s" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-md)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      <div style={{ padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaRegUserCircle size={40} color="var(--color-700)" />
            </div>
            <div>
              <Text
                size="14px"
                fw={800}
                style={{
                  color: "var(--neutral-900)",
                  letterSpacing: "-0.01em",
                }}
              >
                {collab.name}
              </Text>
              <Text size="12px" c="var(--neutral-400)" mt={1}>
                {collab.email}
              </Text>
            </div>
          </div>
          <Menu width={160} position="bottom-end" shadow="lg" radius="md">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" radius="md">
                <RiMoreLine size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<RiEditLine size={13} />}>
                Change Role
              </Menu.Item>
              <Menu.Item leftSection={<RiMailSendLine size={13} />}>
                Send Message
              </Menu.Item>
              <Divider />
              <Menu.Item
                leftSection={<RiDeleteBin6Line size={13} />}
                color="red"
                onClick={onRemove}
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div
          style={{
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: "1px solid var(--neutral-100)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Group gap={6}>
              <Text size="12px" fw={700} c="black">
                {collab.role}
              </Text>
            </Group>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 8px",
                background:
                  collab.status === "active"
                    ? "var(--color-200)"
                    : "var(--warning-light)",
                color:
                  collab.status === "active"
                    ? "var(--color-700)"
                    : "var(--warning)",
                borderRadius: "99px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {collab.status === "active" ? (
                <RiCheckLine size={10} />
              ) : (
                <RiTimeLine size={10} />
              )}
              {collab.status === "active" ? "Active" : "Pending"}
            </span>
          </div>

          <Group gap={8} wrap="wrap">
            {(PERMISSIONS[collab.role as keyof typeof PERMISSIONS] || []).map(
              (perm) => (
                <span
                  key={perm}
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    background: "var(--neutral-100)",
                    color: "var(--neutral-500)",
                    borderRadius: "4px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {perm}
                </span>
              ),
            )}
          </Group>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "10px",
            }}
          >
            <RiFileTextLine size={13} color="var(--neutral-400)" />
            <Text size="12px" fw={600} c="var(--neutral-400)">
              {collab.papers} shared paper{collab.papers !== 1 ? "s" : ""}
            </Text>
            <Text size="12px" c="var(--neutral-300)" mx={2}>
              ·
            </Text>
            <Text size="12px" fw={600} c="var(--neutral-400)">
              {collab.institution}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollaborationsPage() {
  const [collabs, setCollabs] = useState(mockCollaborators);
  const [search, setSearch] = useState("");
  const [inviteOpened, { open, close }] = useDisclosure(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Co-Author");
  const [invitePaper, setInvitePaper] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const filtered = collabs.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInvite = () => {
    if (!inviteEmail) return;
    notifications.show({
      title: "Invitation Sent!",
      message: `Invitation sent to ${inviteEmail} as ${inviteRole}`,
      color: "green",
      icon: <RiMailSendLine />,
    });
    setInviteEmail("");
    close();
  };

  const activeCount = collabs.filter((c) => c.status === "active").length;
  const pendingCount = collabs.filter((c) => c.status === "pending").length;

  return (
    <div className="page-wrapper">
      <div className="page-header" ref={headerRef}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1 className="page-title">Collaborations</h1>
            <p className="page-subtitle">
              {activeCount} active · {pendingCount} pending invitations
            </p>
          </div>
          <button className="btn-primary" onClick={open}>
            <RiAddLine size={14} /> Invite Collaborator
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Total Collaborators", value: collabs.length },
          { label: "Active", value: activeCount },
          { label: "Pending", value: pendingCount },
          {
            label: "Co-Authored Papers",
            value: mockPapers.filter((p) => p.coAuthors.length > 0).length,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ flex: "1", minWidth: "140px" }}
          >
            <div className="stat-card-value" style={{ fontSize: "24px" }}>
              {s.value}
            </div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: "18px" }}>
        <div className="search-bar" style={{ maxWidth: "360px" }}>
          <RiSearchLine size={15} color="var(--neutral-400)" />
          <input
            placeholder="Search collaborators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs: Active / Pending */}
      <Tabs
        defaultValue="all"
        styles={{ tab: { fontFamily: "'Nunito Sans', sans-serif" } }}
      >
        <Tabs.List
          mb="md"
          style={{ borderBottom: "1px solid var(--neutral-150)" }}
        >
          {["all", "active", "pending"].map((t) => (
            <Tabs.Tab
              key={t}
              value={t}
              style={{ fontWeight: 700, fontSize: "13.5px" }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "pending" && pendingCount > 0 && (
                <span
                  style={{
                    marginLeft: "6px",
                    background: "var(--color-700)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "1px 6px",
                    borderRadius: "99px",
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {["all", "active", "pending"].map((tabVal) => (
          <Tabs.Panel key={tabVal} value={tabVal}>
            {filtered.filter((c) => tabVal === "all" || c.status === tabVal)
              .length > 0 ? (
              <Grid gap="md">
                {filtered
                  .filter((c) => tabVal === "all" || c.status === tabVal)
                  .map((collab, i) => (
                    <Grid.Col key={collab.id} span={{ base: 12, sm: 6, lg: 4 }}>
                      <div
                        className="animate-fade-up"
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
                        <CollaboratorCard
                          collab={collab}
                          onRemove={() =>
                            setCollabs((prev) =>
                              prev.filter((c) => c.id !== collab.id),
                            )
                          }
                        />
                      </div>
                    </Grid.Col>
                  ))}
              </Grid>
            ) : (
              <div className="section-card">
                <div className="empty-state">
                  <div className="empty-state-icon">🤝</div>
                  <div className="empty-state-title">No collaborators yet</div>
                  <div className="empty-state-desc">
                    Invite researchers to collaborate on your papers
                  </div>
                  <button className="btn-primary" onClick={open}>
                    <RiAddLine size={14} /> Invite Now
                  </button>
                </div>
              </div>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>

      {/* Invite Modal */}
      <Modal
        opened={inviteOpened}
        onClose={close}
        title="Invite Collaborator"
        size="md"
        centered
      >
        <Stack gap="sm">
          <TextInput
            label="Email Address"
            placeholder="researcher@university.edu"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            leftSection={
              <RiMailSendLine size={14} color="var(--neutral-400)" />
            }
            styles={{ label: { fontWeight: 700 } }}
          />
          <Select
            label="Role"
            data={ROLES}
            value={inviteRole}
            onChange={(v) => setInviteRole(v || "Co-Author")}
            styles={{ label: { fontWeight: 700 } }}
          />
          <Select
            label="Paper (optional)"
            placeholder="Select a paper..."
            data={mockPapers.map((p) => ({ value: p.id, label: p.title }))}
            value={invitePaper}
            onChange={(v) => setInvitePaper(v || "")}
            searchable
            clearable
            styles={{ label: { fontWeight: 700 } }}
          />
          {inviteRole && (
            <div
              style={{
                //background: "var(--color-100)",
                borderRadius: "5px",
                padding: "12px 14px",
                border: "1px solid var(--color-600)",
              }}
            >
              <Text
                size="12px"
                fw={800}
                style={{ color: "var(--color-700)", marginBottom: "6px" }}
              >
                Permissions for {inviteRole}
              </Text>
              <Group gap={6}>
                {(
                  PERMISSIONS[inviteRole as keyof typeof PERMISSIONS] || []
                ).map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      background: "var(--color-200)",
                      color: "var(--color-800)",
                      borderRadius: "4px",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </Group>
            </div>
          )}
          <Divider my={4} />
          <Group justify="flex-end" gap={10}>
            <button className="btn-ghost" onClick={close}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleInvite}>
              <RiMailSendLine size={14} /> Send Invitation
            </button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
