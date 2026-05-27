import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Text,
  Group,
  TextInput,
  Textarea,
  Select,
  Switch,
  Divider,
  MultiSelect,
  Stack,
  PasswordInput,
} from "@mantine/core";
import { gsap } from "gsap";
import {
  RiUserLine,
  RiPaletteLine,
  RiSaveLine,
  RiEditLine,
  RiCheckLine,
  RiLogoutBoxLine,
  RiDeleteBin6Line,
  RiMailLine,
  RiLockLine,
  RiKeyLine,
} from "react-icons/ri";
import { mockUser, RESEARCH_FIELDS, CITATION_STYLES } from "../data/mockData";
import { notifications } from "@mantine/notifications";
import { FaCreditCard } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { TbPropeller } from "react-icons/tb";
import { SiSpringsecurity } from "react-icons/si";
import { GrNotification } from "react-icons/gr";

function SettingsSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--neutral-150)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid var(--neutral-150)",
        }}
      >
        <Text
          size="15px"
          fw={800}
          style={{ color: "var(--neutral-900)", letterSpacing: "-0.01em" }}
        >
          {title}
        </Text>
        {desc && (
          <Text size="12.5px" c="var(--neutral-400)" mt={2}>
            {desc}
          </Text>
        )}
      </div>
      <div style={{ padding: "22px" }}>{children}</div>
    </div>
  );
}

function ToggleSetting({ label, desc, defaultChecked, onChange }: any) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid var(--neutral-100)",
      }}
    >
      <div>
        <Text size="13.5px" fw={700} style={{ color: "var(--neutral-800)" }}>
          {label}
        </Text>
        {desc && (
          <Text size="12px" c="var(--neutral-400)" mt={1}>
            {desc}
          </Text>
        )}
      </div>
      <Switch
        defaultChecked={defaultChecked}
        color="brand"
        size="md"
        onChange={onChange}
      />
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: mockUser.name,
    email: mockUser.email,
    institution: mockUser.institution,
    role: mockUser.role,
    bio: "Senior researcher specializing in biomedical engineering, machine learning, and AI-driven healthcare solutions. Published 24+ papers in top-tier journals.",
    orcid: "0000-0002-1234-5678",
    researchGate: "Adebayo_Okonkwo",
    googleScholar: "scholar.google.com/citations?user=example",
    fields: ["Biomedical Engineering", "Machine Learning"],
    defaultCitationStyle: "APA 7th Edition",
  });
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const handleSave = () => {
    notifications.show({
      title: "Settings Saved",
      message: "Your profile has been updated successfully.",
      color: "green",
      icon: <RiCheckLine />,
    });
  };

  const tabItems = [
    { value: "profile", label: "Profile", icon: <RiUserLine size={15} /> },
    {
      value: "notifications",
      label: "Notifications",
      icon: <GrNotification size={15} />,
    },
    {
      value: "security",
      label: "Security",
      icon: <SiSpringsecurity size={15} />,
    },
    {
      value: "preferences",
      label: "Preferences",
      icon: <RiPaletteLine size={15} />,
    },
    {
      value: "billing",
      label: "Billing",
      icon: <FaCreditCard size={15} />,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header" ref={headerRef}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage your account, preferences, and billing
          </p>
        </div>
      </div>

      <Grid gap="md">
        {/* Left: Tab Nav */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--neutral-150)",
              boxShadow: "var(--shadow-card)",
              overflow: "hidden",
              position: "sticky",
              top: "20px",
            }}
          >
            {/* User Preview */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid var(--neutral-150)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <FaRegUserCircle size={40} color="var(--color-700)" />
              </div>
              <Text
                size="14px"
                fw={800}
                style={{
                  color: "var(--neutral-900)",
                  letterSpacing: "-0.01em",
                }}
              >
                {mockUser.name}
              </Text>
              <Text size="12px" c="var(--neutral-400)" mt={2}>
                {mockUser.role}
              </Text>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "8px",
                  background: "var(--color-100)",
                  color: "var(--color-700)",
                  padding: "3px 10px",
                  borderRadius: "99px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                <TbPropeller size={20} color="var(--color-700)" /> Pro Plan
              </div>
            </div>

            {/* Nav Links */}
            <div style={{ padding: "8px" }}>
              {tabItems.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "10px 12px",
                    background:
                      activeTab === tab.value
                        ? "var(--color-100)"
                        : "transparent",
                    color:
                      activeTab === tab.value
                        ? "var(--color-700)"
                        : "var(--neutral-600)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    fontFamily: "'Nunito Sans', sans-serif",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.value)
                      e.currentTarget.style.background = "var(--neutral-50)";
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.value)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}

              <Divider my={8} />

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 12px",
                  background: "transparent",
                  color: "var(--error)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--error-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <RiLogoutBoxLine size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </Grid.Col>

        {/* Right: Content */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="animate-fade-up">
              <SettingsSection
                title="Personal Information"
                desc="Update your public researcher profile"
              >
                <Grid gap="sm">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email Address"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, email: e.target.value }))
                      }
                      leftSection={
                        <RiMailLine size={14} color="var(--neutral-400)" />
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Institution / Affiliation"
                      value={profile.institution}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          institution: e.target.value,
                        }))
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Role / Title"
                      value={profile.role}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, role: e.target.value }))
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Research Bio"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, bio: e.target.value }))
                      }
                      minRows={3}
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <MultiSelect
                      label="Research Fields"
                      data={RESEARCH_FIELDS}
                      value={profile.fields}
                      onChange={(v) => setProfile((p) => ({ ...p, fields: v }))}
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                </Grid>
              </SettingsSection>

              <SettingsSection
                title="Academic Profiles"
                desc="Connect your external researcher profiles"
              >
                <Grid gap="sm">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="ORCID iD"
                      value={profile.orcid}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, orcid: e.target.value }))
                      }
                      placeholder="0000-0000-0000-0000"
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="ResearchGate Username"
                      value={profile.researchGate}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          researchGate: e.target.value,
                        }))
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Google Scholar URL"
                      value={profile.googleScholar}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          googleScholar: e.target.value,
                        }))
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                </Grid>
              </SettingsSection>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button className="btn-ghost">Cancel</button>
                <button className="btn-primary" onClick={handleSave}>
                  <RiSaveLine size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="animate-fade-up">
              <SettingsSection
                title="Email Notifications"
                desc="Choose when you receive email alerts"
              >
                <ToggleSetting
                  label="Citation Alerts"
                  desc="Get notified when your paper is cited"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Review Received"
                  desc="Alert when peer review is submitted"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Submission Updates"
                  desc="Status changes on your journal submissions"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Collaboration Invites"
                  desc="When someone invites you to collaborate"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Achievement Unlocked"
                  desc="Celebrate your research milestones"
                  defaultChecked={false}
                />
                <ToggleSetting
                  label="Weekly Digest"
                  desc="Weekly summary of your research activity"
                  defaultChecked={true}
                />
              </SettingsSection>

              <SettingsSection title="In-App Notifications">
                <ToggleSetting
                  label="All Notifications"
                  desc="Show notification bell alerts"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Collaboration Messages"
                  desc="Messages from co-authors and reviewers"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Journal Deadlines"
                  desc="Reminder for upcoming submission deadlines"
                  defaultChecked={true}
                />
              </SettingsSection>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-primary" onClick={handleSave}>
                  <RiSaveLine size={14} /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="animate-fade-up">
              <SettingsSection title="Change Password">
                <Stack gap="sm" style={{ maxWidth: "420px" }}>
                  <PasswordInput
                    label="Current Password"
                    placeholder="Enter current password"
                    leftSection={
                      <RiLockLine size={14} color="var(--neutral-400)" />
                    }
                    styles={{ label: { fontWeight: 700 } }}
                  />
                  <PasswordInput
                    label="New Password"
                    placeholder="Minimum 8 characters"
                    leftSection={
                      <RiKeyLine size={14} color="var(--neutral-400)" />
                    }
                    styles={{ label: { fontWeight: 700 } }}
                  />
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Repeat new password"
                    leftSection={
                      <RiKeyLine size={14} color="var(--neutral-400)" />
                    }
                    styles={{ label: { fontWeight: 700 } }}
                  />
                  <button
                    className="btn-primary"
                    style={{ alignSelf: "flex-start" }}
                    onClick={handleSave}
                  >
                    Update Password
                  </button>
                </Stack>
              </SettingsSection>

              <SettingsSection
                title="Two-Factor Authentication"
                desc="Add an extra layer of security to your account"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <div>
                    <Text size="14px" fw={700} c="var(--neutral-800)">
                      Authenticator App (TOTP)
                    </Text>
                    <Text size="12.5px" c="var(--neutral-400)" mt={2}>
                      Use Google Authenticator or similar
                    </Text>
                  </div>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </SettingsSection>

              <SettingsSection title="Active Sessions">
                {[
                  {
                    device: "Chrome on MacOS",
                    location: "Lagos, Nigeria",
                    time: "Active now",
                    current: true,
                  },
                  {
                    device: "Safari on iPhone",
                    location: "Lagos, Nigeria",
                    time: "2 hours ago",
                    current: false,
                  },
                ].map((session, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom:
                        i === 0 ? "1px solid var(--neutral-100)" : "none",
                    }}
                  >
                    <div>
                      <Group gap={8}>
                        <Text size="13.5px" fw={700} c="var(--neutral-800)">
                          {session.device}
                        </Text>
                        {session.current && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 7px",
                              background: "var(--success-light)",
                              color: "var(--success)",
                              borderRadius: "99px",
                            }}
                          >
                            Current
                          </span>
                        )}
                      </Group>
                      <Text size="12px" c="var(--neutral-400)" mt={1}>
                        {session.location} · {session.time}
                      </Text>
                    </div>
                    {!session.current && (
                      <button
                        className="btn-ghost"
                        style={{ color: "var(--error)", fontSize: "12.5px" }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </SettingsSection>

              <SettingsSection title="Danger Zone">
                <div
                  style={{
                    border: "1.5px solid var(--error-light)",
                    borderRadius: "10px",
                    padding: "16px",
                  }}
                >
                  <Text
                    size="13.5px"
                    fw={800}
                    style={{ color: "var(--error)", marginBottom: "4px" }}
                  >
                    Delete Account
                  </Text>
                  <Text size="12.5px" c="var(--neutral-500)" mb={12}>
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </Text>
                  <button
                    style={{
                      padding: "8px 16px",
                      background: "var(--error)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Nunito Sans', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <RiDeleteBin6Line size={14} /> Delete Account
                  </button>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="animate-fade-up">
              <SettingsSection
                title="Writing Preferences"
                desc="Default settings for paper generation"
              >
                <Grid gap="sm">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Default Citation Style"
                      data={CITATION_STYLES}
                      value={profile.defaultCitationStyle}
                      onChange={(v) =>
                        setProfile((p) => ({
                          ...p,
                          defaultCitationStyle: v || "APA 7th Edition",
                        }))
                      }
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Default Writing Tone"
                      data={[
                        "Formal (Academic)",
                        "Technical",
                        "Analytical",
                        "Balanced",
                      ]}
                      defaultValue="Formal (Academic)"
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Default Paper Language"
                      data={[
                        "English (US)",
                        "English (UK)",
                        "French",
                        "Spanish",
                        "German",
                        "Portuguese",
                      ]}
                      defaultValue="English (US)"
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Auto-save Interval"
                      data={[
                        "Every 30 seconds",
                        "Every minute",
                        "Every 5 minutes",
                        "Manually",
                      ]}
                      defaultValue="Every minute"
                      styles={{ label: { fontWeight: 700 } }}
                    />
                  </Grid.Col>
                </Grid>
              </SettingsSection>

              <SettingsSection title="Display Preferences">
                <ToggleSetting
                  label="Dark Mode"
                  desc="Switch to dark theme (coming soon)"
                  defaultChecked={false}
                />
                <ToggleSetting
                  label="Compact View"
                  desc="Show more content with reduced spacing"
                  defaultChecked={false}
                />
                <ToggleSetting
                  label="Show Word Count"
                  desc="Display word count on all papers"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Show Page Count"
                  desc="Display estimated page count"
                  defaultChecked={true}
                />
              </SettingsSection>

              <SettingsSection title="AI Generation Settings">
                <ToggleSetting
                  label="Auto-generate References"
                  desc="Automatically format and add references"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Plagiarism Check"
                  desc="Run plagiarism check after generation"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Grammar Suggestions"
                  desc="Show AI grammar improvement suggestions"
                  defaultChecked={true}
                />
                <ToggleSetting
                  label="Journal Matching"
                  desc="Suggest journals based on paper content"
                  defaultChecked={true}
                />
              </SettingsSection>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-primary" onClick={handleSave}>
                  <RiSaveLine size={14} /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === "billing" && (
            <div className="animate-fade-up">
              <SettingsSection title="Current Plan">
                <div
                  style={{
                    border: "2px solid var(--color-600)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <Group gap={10} mb={6}>
                        <Text
                          size="20px"
                          fw={900}
                          style={{
                            color: "var(--color-800)",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          Pro Plan
                        </Text>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "3px 9px",
                            background: "var(--color-700)",
                            color: "#fff",
                            borderRadius: "99px",
                          }}
                        >
                          Active
                        </span>
                      </Group>
                      <Text size="13px" c="var(--color-700)" fw={600}>
                        Unlimited paper generation · Priority AI · All journals
                      </Text>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text
                        size="28px"
                        fw={900}
                        style={{
                          color: "var(--color-800)",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        $29
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>
                          /mo
                        </span>
                      </Text>
                      <Text size="12px" c="var(--color-700)">
                        Renews June 27, 2026
                      </Text>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn-secondary">Upgrade to Team</button>
                  <button
                    className="btn-ghost"
                    style={{ color: "var(--error)" }}
                  >
                    Cancel Plan
                  </button>
                </div>
              </SettingsSection>

              <SettingsSection title="Payment Method">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    border: "1.5px solid var(--neutral-200)",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <Group gap={12}>
                    <div
                      style={{
                        width: 40,
                        height: 28,
                        background: "var(--neutral-900)",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 900,
                        color: "#fff",
                        letterSpacing: "0.05em",
                      }}
                    >
                      VISA
                    </div>
                    <div>
                      <Text size="13.5px" fw={700} c="var(--neutral-800)">
                        •••• •••• •••• 4242
                      </Text>
                      <Text size="12px" c="var(--neutral-400)">
                        Expires 12/2027
                      </Text>
                    </div>
                  </Group>
                  <button className="btn-ghost" style={{ fontSize: "12.5px" }}>
                    <RiEditLine size={13} /> Edit
                  </button>
                </div>
                <button className="btn-secondary" style={{ fontSize: "13px" }}>
                  <FaCreditCard size={14} /> Add Payment Method
                </button>
              </SettingsSection>

              <SettingsSection title="Billing History">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        date: "May 27, 2026",
                        desc: "Pro Plan - Monthly",
                        amount: "$29.00",
                        status: "Paid",
                      },
                      {
                        date: "Apr 27, 2026",
                        desc: "Pro Plan - Monthly",
                        amount: "$29.00",
                        status: "Paid",
                      },
                      {
                        date: "Mar 27, 2026",
                        desc: "Pro Plan - Monthly",
                        amount: "$29.00",
                        status: "Paid",
                      },
                    ].map((inv, i) => (
                      <tr key={i}>
                        <td>{inv.date}</td>
                        <td>{inv.desc}</td>
                        <td>
                          <Text fw={700} size="13.5px">
                            {inv.amount}
                          </Text>
                        </td>
                        <td>
                          <span className="status-badge published">
                            {inv.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-ghost"
                            style={{ fontSize: "12px", padding: "4px 8px" }}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SettingsSection>
            </div>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
