import { useRef, useEffect, useState } from "react";
import { Grid, Text, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import { RiTrophyLine, RiLockLine, RiCheckLine } from "react-icons/ri";
import { mockAchievements } from "../data/mockData";

const RARITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; glow: string }
> = {
  common: { label: "Common", color: "#6b7280", bg: "#f3f4f6", glow: "none" },
  uncommon: {
    label: "Uncommon",
    color: "#0369a1",
    bg: "#dbeafe",
    glow: "0 0 12px rgba(3,105,161,0.25)",
  },
  rare: {
    label: "Rare",
    color: "#7c3aed",
    bg: "#ede9fe",
    glow: "0 0 16px rgba(124,58,237,0.3)",
  },
  epic: {
    label: "Epic",
    color: "#c9184a",
    bg: "var(--color-100)",
    glow: "0 0 20px rgba(201,24,74,0.3)",
  },
  legendary: {
    label: "Legendary",
    color: "#92400e",
    bg: "#fef3c7",
    glow: "0 0 24px rgba(234,179,8,0.4)",
  },
};

function AchievementCard({ achievement, onClick }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const config = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;

  useEffect(() => {
    if (cardRef.current && achievement.earned) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(achievement)}
      className="achievement-card"
      style={{
        cursor: "pointer",
        boxShadow: achievement.earned ? config.glow : "none",
        borderColor: achievement.earned
          ? config.color + "40"
          : "var(--neutral-150)",
      }}
    >
      {/* Rarity badge */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "10px",
          fontWeight: 800,
          padding: "2px 7px",
          background: achievement.earned ? config.bg : "var(--neutral-100)",
          color: achievement.earned ? config.color : "var(--neutral-300)",
          borderRadius: "99px",
          letterSpacing: "0.04em",
        }}
      >
        {config.label}
      </div>

      {/* Icon */}
      <div
        style={{
          fontSize: "40px",
          marginBottom: "10px",
          filter: achievement.earned ? "none" : "grayscale(1)",
          opacity: achievement.earned ? 1 : 0.2,
          transition: "all 0.3s",
        }}
      >
        {achievement.icon}
      </div>

      {/* Lock indicator for unearned */}
      {!achievement.earned && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            color: "var(--neutral-300)",
          }}
        >
          <RiLockLine size={14} />
        </div>
      )}

      <Text
        size="13px"
        fw={800}
        style={{
          color: achievement.earned
            ? "var(--neutral-900)"
            : "var(--neutral-400)",
          marginBottom: "4px",
          letterSpacing: "-0.01em",
        }}
      >
        {achievement.title}
      </Text>
      <Text
        size="11.5px"
        style={{
          color: achievement.earned
            ? "var(--neutral-500)"
            : "var(--neutral-300)",
          lineHeight: 1.4,
        }}
      >
        {achievement.description}
      </Text>

      {achievement.earned && achievement.earnedDate && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <RiCheckLine size={11} color="var(--success)" />
          <Text size="10.5px" fw={700} style={{ color: "var(--success)" }}>
            {new Date(achievement.earnedDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </Text>
        </div>
      )}
    </div>
  );
}

export function AchievementsPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [detailOpened, { open, close }] = useDisclosure(false);
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const earned = mockAchievements.filter((a) => a.earned);
  const locked = mockAchievements.filter((a) => !a.earned);
  const progress = Math.round((earned.length / mockAchievements.length) * 100);

  const filtered = mockAchievements.filter((a) => {
    if (filter === "earned") return a.earned;
    if (filter === "locked") return !a.earned;
    return true;
  });

  const handleClick = (achievement: any) => {
    setSelectedAchievement(achievement);
    open();
  };

  // Group by rarity for display
  const rarityOrder = ["legendary", "epic", "rare", "uncommon", "common"];
  const grouped: Record<string, typeof mockAchievements> = {};
  filtered.forEach((a) => {
    if (!grouped[a.rarity]) grouped[a.rarity] = [];
    grouped[a.rarity].push(a);
  });

  return (
    <div className="page-wrapper">
      <div className="page-header" ref={headerRef}>
        <div>
          <Text
            size="13px"
            fw={600}
            style={{
              color: "var(--color-600)",
              marginBottom: "4px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <RiTrophyLine size={13} style={{ marginRight: "4px" }} /> Your
            Milestones
          </Text>
          <h1 className="page-title">Achievements</h1>
          <p className="page-subtitle">
            Celebrate your research milestones and track your academic journey
          </p>
        </div>
      </div>

      {/* Progress Banner */}
      <div
        className="section-card animate-fade-up"
        style={{ marginBottom: "24px" }}
      >
        <div className="section-card-body">
          <Grid gap="xl" align="center">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "14px",
                    background: "var(--color-100)",
                    border: "2px solid var(--color-200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    flexShrink: 0,
                  }}
                >
                  🏆
                </div>
                <div>
                  <Text
                    size="18px"
                    fw={900}
                    style={{
                      color: "var(--neutral-900)",
                      letterSpacing: "-0.02em",
                      marginBottom: "2px",
                    }}
                  >
                    {earned.length} of {mockAchievements.length} Achievements
                  </Text>
                  <Text size="13px" c="var(--neutral-500)" fw={500}>
                    {locked.length} more to unlock · Keep publishing!
                  </Text>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    className="progress-bar-container"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <Text
                  size="14px"
                  fw={900}
                  style={{ color: "var(--color-700)", flexShrink: 0 }}
                >
                  {progress}%
                </Text>
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                }}
              >
                {Object.entries(RARITY_CONFIG)
                  .filter(([k]) => k !== "common")
                  .map(([key, cfg]) => {
                    const count = mockAchievements.filter(
                      (a) => a.rarity === key && a.earned,
                    ).length;
                    return (
                      <div
                        key={key}
                        style={{
                          background: cfg.bg,
                          borderRadius: "8px",
                          padding: "8px 10px",
                          border: `1px solid ${cfg.color}30`,
                        }}
                      >
                        <Text
                          size="10px"
                          fw={800}
                          style={{
                            color: cfg.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {cfg.label}
                        </Text>
                        <Text size="18px" fw={900} style={{ color: cfg.color }}>
                          {count}
                        </Text>
                      </div>
                    );
                  })}
              </div>
            </Grid.Col>
          </Grid>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {[
          { val: "all", label: `All (${mockAchievements.length})` },
          { val: "earned", label: `Earned (${earned.length})` },
          { val: "locked", label: `Locked (${locked.length})` },
        ].map((t) => (
          <button
            key={t.val}
            className={`filter-chip ${filter === t.val ? "active" : ""}`}
            onClick={() => setFilter(t.val as any)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Achievements by Rarity */}
      {rarityOrder.map((rarity) => {
        const items = grouped[rarity];
        if (!items || items.length === 0) return null;
        const cfg = RARITY_CONFIG[rarity];
        return (
          <div key={rarity} style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 10px",
                  background: cfg.bg,
                  color: cfg.color,
                  borderRadius: "99px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {cfg.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--neutral-150)",
                }}
              />
            </div>
            <Grid gap="md">
              {items.map((achievement) => (
                <Grid.Col
                  key={achievement.id}
                  span={{ base: 6, sm: 4, md: 3, lg: 2 }}
                >
                  <div
                    className="animate-fade-up"
                    style={{ position: "relative" }}
                  >
                    <AchievementCard
                      achievement={achievement}
                      onClick={handleClick}
                    />
                  </div>
                </Grid.Col>
              ))}
            </Grid>
          </div>
        );
      })}

      {/* Achievement Detail Modal */}
      <Modal
        opened={detailOpened && !!selectedAchievement}
        onClose={close}
        title="Achievement Details"
        size="sm"
        centered
      >
        {selectedAchievement &&
          (() => {
            const cfg = RARITY_CONFIG[selectedAchievement.rarity];
            return (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div
                  style={{
                    fontSize: "64px",
                    marginBottom: "16px",
                    filter: selectedAchievement.earned
                      ? "none"
                      : "grayscale(1)",
                    opacity: selectedAchievement.earned ? 1 : 0.3,
                  }}
                >
                  {selectedAchievement.icon}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "4px 12px",
                    background: selectedAchievement.earned
                      ? cfg.bg
                      : "var(--neutral-100)",
                    color: selectedAchievement.earned
                      ? cfg.color
                      : "var(--neutral-400)",
                    borderRadius: "99px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {cfg.label}
                </span>
                <Text
                  size="20px"
                  fw={900}
                  style={{
                    color: "var(--neutral-900)",
                    marginTop: "14px",
                    marginBottom: "8px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedAchievement.title}
                </Text>
                <Text
                  size="14px"
                  c="var(--neutral-500)"
                  style={{ lineHeight: 1.5, marginBottom: "16px" }}
                >
                  {selectedAchievement.description}
                </Text>
                {selectedAchievement.earned ? (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "var(--success-light)",
                      color: "var(--success)",
                      padding: "8px 16px",
                      borderRadius: "99px",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}
                  >
                    <RiCheckLine size={14} />
                    Earned on{" "}
                    {new Date(
                      selectedAchievement.earnedDate,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "var(--neutral-100)",
                      color: "var(--neutral-500)",
                      padding: "8px 16px",
                      borderRadius: "99px",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}
                  >
                    <RiLockLine size={14} />
                    Not yet earned
                  </div>
                )}
              </div>
            );
          })()}
      </Modal>
    </div>
  );
}
