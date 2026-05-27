import { useEffect, useRef } from "react";
import { Grid, Group, Text, Stack } from "@mantine/core";
import { gsap } from "gsap";
import {
  RiFileTextLine,
  RiArrowRightLine,
  RiTrophyLine,
  RiBarChartLine,
  RiBookOpenLine,
} from "react-icons/ri";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  mockUser,
  mockPapers,
  mockRecentActivity,
  mockAnalyticsData,
  mockAchievements,
} from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { RiNumber1, RiNumber2, RiNumber3, RiNumber4 } from "react-icons/ri";

function StatCard({ icon, label, value, delay = 0 }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay, ease: "power2.out" },
      );
    }
    if (valueRef.current) {
      const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ""));
      if (!isNaN(numericValue)) {
        /* gsap.fromTo(
          { val: 0 },
          {
            val: numericValue,
            duration: 1.2,
            delay: delay + 0.3,
            ease: 'power2.out',
            onUpdate: function () {
              if (valueRef.current) {
                const v = Math.round(this.targets()[0].val);
                valueRef.current.textContent = value.toString().replace(/[0-9,]+/, v.toLocaleString());
              }
            },
          }
        ); */
      }
    }
  }, []);

  return (
    <div className="stat-card" ref={cardRef}>
      <div
        className="stat-card-icon" /* style={{ background: `${color}18` }} */
      >
        {icon}
      </div>
      <div className="stat-card-value" ref={valueRef}>
        {value}
      </div>
      <div className="stat-card-label">{label}</div>
      {/* {trend && (
        <div className={`stat-card-trend ${trend > 0 ? "up" : "down"}`}>
          <RiArrowUpLine
            size={11}
            style={{ transform: trend < 0 ? "rotate(180deg)" : "none" }}
          />
          {Math.abs(trend)}% {trendLabel}
        </div>
      )} */}
    </div>
  );
}

function QuickAction({ icon, label, desc, onClick }: any) {
  return (
    <div
      className="action-card"
      onClick={onClick}
      style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <Text
          size="13.5px"
          fw={800}
          style={{ color: "var(--neutral-900)", marginBottom: "2px" }}
        >
          {label}
        </Text>
        <Text size="12px" c="var(--neutral-400)" fw={500} lh={1.3}>
          {desc}
        </Text>
      </div>
      <RiArrowRightLine
        size={15}
        color="var(--neutral-300)"
        style={{ marginLeft: "auto", marginTop: "2px", flexShrink: 0 }}
      />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--neutral-150)",
          borderRadius: "10px",
          padding: "10px 14px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <Text size="11px" fw={800} c="var(--neutral-400)" mb={4}>
          {label}
        </Text>
        {payload.map((p: any) => (
          <Text key={p.name} size="13px" fw={700} style={{ color: p.color }}>
            {p.name === "citations" ? "📖 " : "📄 "}
            {p.value} {p.name}
          </Text>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  /* const publishedCount = mockPapers.filter(
    (p) => p.status === "published",
  ).length; */
  const totalCitations = mockUser.citations;
  const earnedAchievements = mockAchievements.filter((a) => a.earned).length;

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, []);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      published: "var(--success)",
      review: "var(--warning)",
      submitted: "var(--info)",
      draft: "var(--neutral-400)",
      rejected: "var(--error)",
    };
    return map[status] || "var(--neutral-400)";
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
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
            <h1 className="page-title">
              Good morning, {mockUser.name.split(" ")[1]}!
            </h1>
            <p className="page-subtitle">
              Here's an overview of your research activity and progress.
            </p>
          </div>
          <Group gap={8}>
            <button
              className="btn-secondary"
              onClick={() => navigate("/papers")}
            >
              <RiFileTextLine size={14} /> My Papers
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/generate")}
            >
              {/* <RiFlashlightLine size={14} /> Generate Paper */}
              Generate Paper
            </button>
          </Group>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stagger" style={{ marginBottom: "24px" }}>
        <StatCard
          icon={<RiFileTextLine size={20} color="var(--color-700)" />}
          label="Total Papers"
          value={mockPapers.length}
          trend={12}
          trendLabel="this month"
          color="#c9184a"
          delay={0}
        />
        <StatCard
          icon={<RiBookOpenLine size={20} color="var(--color-700)" />}
          label="Total Citations"
          value={totalCitations.toLocaleString()}
          trend={18}
          trendLabel="vs last month"
          color="#0ba5ec"
          delay={0.08}
        />
        <StatCard
          icon={<RiBarChartLine size={20} color="var(--color-700)" />}
          label="H-Index"
          value={mockUser.hIndex}
          trend={1}
          trendLabel="this quarter"
          color="#12b76a"
          delay={0.16}
        />
        <StatCard
          icon={<RiTrophyLine size={20} color="var(--color-700)" />}
          label="Achievements"
          value={`${earnedAchievements}/${mockAchievements.length}`}
          trend={null}
          trendLabel=""
          color="#f79009"
          delay={0.24}
        />
      </div>

      {/* Main Content Grid */}
      <Grid gap="md" align="stretch">
        {/* Citation Trend Chart */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.2s", height: "100%" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Citations Over Time</span>
              <Group gap={6}>
                {["6M", "1Y", "All"].map((t) => (
                  <button
                    key={t}
                    className="btn-ghost"
                    style={{ padding: "4px 10px", fontSize: "12px" }}
                  >
                    {t}
                  </button>
                ))}
              </Group>
            </div>
            <div className="section-card-body">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={mockAnalyticsData.papersOverTime}
                  margin={{ top: 5, right: 5, bottom: 0, left: -10 }}
                >
                  <defs>
                    <linearGradient
                      id="citationsGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#c9184a"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#c9184a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--neutral-100)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11,
                      fill: "var(--neutral-400)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 600,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "var(--neutral-400)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 600,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="citations"
                    stroke="#c9184a"
                    strokeWidth={2.5}
                    fill="url(#citationsGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#c9184a", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Grid.Col>

        {/* Quick Actions */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.28s", height: "100%" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Quick Actions</span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <QuickAction
                icon={<RiNumber1 size={20} color="var(--color-700)" />}
                label="New Research Paper"
                desc="Generate a complete paper with AI"
                color="#c9184a"
                onClick={() => navigate("/generate")}
              />
              <QuickAction
                icon={<RiNumber2 size={20} color="var(--color-700)" />}
                label="Submit to Journal"
                desc="Send your paper for publication"
                color="#0ba5ec"
                onClick={() => navigate("/submissions")}
              />
              <QuickAction
                icon={<RiNumber3 size={20} color="var(--color-700)" />}
                label="Find Journals"
                desc="Discover the right venue for your work"
                color="#12b76a"
                onClick={() => navigate("/discover")}
              />
              <QuickAction
                icon={<RiNumber4 size={20} color="var(--color-700)" />}
                label="Invite Collaborator"
                desc="Add a co-author to your research"
                color="#f79009"
                onClick={() => navigate("/collaborations")}
              />
            </div>
          </div>
        </Grid.Col>

        {/* Recent Papers */}
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.32s", height: "100%" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Recent Papers</span>
              <button
                className="btn-ghost"
                style={{ fontSize: "12.5px" }}
                onClick={() => navigate("/papers")}
              >
                View all <RiArrowRightLine size={12} />
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Journal</th>
                    <th>Status</th>
                    <th>Citations</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPapers.slice(0, 4).map((paper) => (
                    <tr
                      key={paper.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/papers")}
                    >
                      <td style={{ maxWidth: "260px" }}>
                        <Text
                          size="13px"
                          fw={700}
                          style={{
                            color: "var(--neutral-800)",
                            lineHeight: 1.3,
                          }}
                          lineClamp={2}
                        >
                          {paper.title}
                        </Text>
                        <Text size="11px" c="var(--neutral-400)" mt={2}>
                          {paper.coAuthors.length > 0
                            ? `+${paper.coAuthors.length} co-author${paper.coAuthors.length > 1 ? "s" : ""}`
                            : "Solo"}
                        </Text>
                      </td>
                      <td>
                        <Text
                          size="12px"
                          fw={600}
                          c="var(--neutral-500)"
                          lineClamp={1}
                          style={{ maxWidth: "120px" }}
                        >
                          {paper.journal || "—"}
                        </Text>
                      </td>
                      <td>
                        <span className={`status-badge ${paper.status}`}>
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: getStatusColor(paper.status),
                              display: "inline-block",
                            }}
                          />
                          {paper.status.charAt(0).toUpperCase() +
                            paper.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Text
                          size="13px"
                          fw={700}
                          style={{
                            color:
                              paper.citations > 0
                                ? "var(--color-700)"
                                : "var(--neutral-300)",
                          }}
                        >
                          {paper.citations > 0 ? paper.citations : "—"}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Grid.Col>

        {/* Progress + Activity */}
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack gap="md">
            {/* Research Progress */}
            <div
              className="section-card animate-fade-up"
              style={{ animationDelay: "0.36s", height: "100%" }}
            >
              <div className="section-card-header">
                <span className="section-card-title">Active Research</span>
                <button
                  className="btn-ghost"
                  style={{ fontSize: "12.5px" }}
                  onClick={() => navigate("/generate")}
                >
                  Continue <RiArrowRightLine size={12} />
                </button>
              </div>
              <div className="section-card-body">
                {mockPapers
                  .filter((p) => p.status === "draft")
                  .map((paper) => (
                    <div key={paper.id} style={{ marginBottom: "14px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <Text
                          size="13px"
                          fw={700}
                          style={{
                            color: "var(--neutral-800)",
                            lineHeight: 1.3,
                            flex: 1,
                            marginRight: "10px",
                          }}
                          lineClamp={2}
                        >
                          {paper.title}
                        </Text>
                        <Text
                          size="12px"
                          fw={800}
                          style={{ color: "var(--color-700)", flexShrink: 0 }}
                        >
                          {paper.completionRate}%
                        </Text>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${paper.completionRate}%` }}
                        />
                      </div>
                      <Text size="11px" c="var(--neutral-400)" mt={4}>
                        {paper.wordCount.toLocaleString()} words · {paper.pages}{" "}
                        pages
                      </Text>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className="section-card animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="section-card-header">
                <span className="section-card-title">Recent Activity</span>
              </div>
              <div className="section-card-body" style={{ padding: "12px 0" }}>
                {mockRecentActivity.slice(0, 4).map((activity, i) => (
                  <div
                    key={activity.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px 20px",
                      borderBottom:
                        i < 3 ? "1px solid var(--neutral-100)" : "none",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size="12.5px"
                        fw={600}
                        style={{
                          color: "var(--neutral-700)",
                          lineHeight: 1.35,
                        }}
                        lineClamp={2}
                      >
                        {activity.message}
                      </Text>
                      <Text size="11px" c="var(--neutral-400)" mt={2}>
                        {activity.time}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}
