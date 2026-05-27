import { useRef, useEffect, useState } from "react";
import { Grid, Text, Group } from "@mantine/core";
import { gsap } from "gsap";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import {
  //RiTrendingUpLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";
import { mockAnalyticsData, mockUser, mockPapers } from "../data/mockData";

const BRAND_COLORS = ["#c9184a", "#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1"];

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
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <Text size="11px" fw={800} c="var(--neutral-400)" mb={4}>
          {label}
        </Text>
        {payload.map((p: any) => (
          <Text key={p.name} size="13px" fw={700} style={{ color: p.color }}>
            {p.value} {p.name}
          </Text>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={800}
      fontFamily="'Nunito Sans', sans-serif"
    >
      {value}
    </text>
  );
};

function MetricCard({ label, value, change, changeLabel }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current)
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
  }, []);

  const isPositive = change >= 0;

  return (
    <div ref={cardRef} className="stat-card">
      <div ref={valueRef} className="stat-card-value">
        {value}
      </div>
      <div className="stat-card-label">{label}</div>
      {change !== undefined && (
        <div
          className={`stat-card-trend ${isPositive ? "up" : "down"}`}
          style={{ marginTop: "10px" }}
        >
          {isPositive ? (
            <RiArrowUpLine size={11} />
          ) : (
            <RiArrowDownLine size={11} />
          )}
          {Math.abs(change)}% {changeLabel}
        </div>
      )}
    </div>
  );
}

const radarData = [
  { subject: "Novelty", score: 82 },
  { subject: "Impact", score: 88 },
  { subject: "Methodology", score: 75 },
  { subject: "Collaboration", score: 70 },
  { subject: "Outreach", score: 60 },
  { subject: "Speed", score: 79 },
];

const journalDistribution = [
  { name: "Q1 Journals", value: 12, fill: "#c9184a" },
  { name: "Q2 Journals", value: 7, fill: "#ff4d6d" },
  { name: "Q3 Journals", value: 3, fill: "#ff758f" },
  { name: "Conference", value: 2, fill: "#ffb3c1" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("12m");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const totalPapers = mockPapers.length;
  const published = mockPapers.filter((p) => p.status === "published").length;

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
            <h1 className="page-title">Research Analytics</h1>
            <p className="page-subtitle">
              Deep insights into your academic impact and publication
              performance
            </p>
          </div>
          <Group gap={8}>
            {["3m", "6m", "12m", "All"].map((p) => (
              <button
                key={p}
                className={`filter-chip ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </Group>
        </div>
      </div>

      {/* KPI Row */}
      <div className="stats-grid stagger" style={{ marginBottom: "24px" }}>
        <MetricCard
          label="Total Citations"
          value={mockUser.citations}
          change={18}
          changeLabel="vs last period"
          icon="📖"
          accent="#c9184a"
        />
        <MetricCard
          label="H-Index"
          value={mockUser.hIndex}
          change={1}
          changeLabel="this quarter"
          icon="📊"
          accent="#0ba5ec"
        />
        <MetricCard
          label="Papers Published"
          value={published}
          change={25}
          changeLabel="this year"
          icon="✅"
          accent="#12b76a"
        />
        <MetricCard
          label="Avg. Citations/Paper"
          value={Math.round(mockUser.citations / totalPapers)}
          change={8}
          changeLabel="improvement"
          icon="📈"
          accent="#f79009"
        />
      </div>

      <Grid gap="md">
        {/* Citations Over Time */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">
                Citations & Publications Over Time
              </span>
            </div>
            <div className="section-card-body">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={mockAnalyticsData.papersOverTime}
                  margin={{ top: 5, right: 5, bottom: 0, left: -10 }}
                >
                  <defs>
                    <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#c9184a"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#c9184a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#0ba5ec"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#0ba5ec" stopOpacity={0} />
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
                  <Legend
                    wrapperStyle={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="citations"
                    name="Citations"
                    stroke="#c9184a"
                    strokeWidth={2.5}
                    fill="url(#cGrad)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="papers"
                    name="Papers"
                    stroke="#0ba5ec"
                    strokeWidth={2}
                    fill="url(#pGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Grid.Col>

        {/* Submission Outcomes */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Submission Outcomes</span>
            </div>
            <div
              className="section-card-body"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={mockAnalyticsData.submissionOutcomes}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={40}
                    dataKey="value"
                    labelLine={false}
                    label={CustomPieLabel}
                  >
                    {mockAnalyticsData.submissionOutcomes.map(
                      (entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ),
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  width: "100%",
                  marginTop: "4px",
                }}
              >
                {mockAnalyticsData.submissionOutcomes.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Group gap={8}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "3px",
                          background: item.color,
                        }}
                      />
                      <Text size="12.5px" fw={600} c="var(--neutral-600)">
                        {item.name}
                      </Text>
                    </Group>
                    <Text size="12.5px" fw={800} c="var(--neutral-800)">
                      {item.value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid.Col>

        {/* Field Distribution Bar Chart */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Publications by Field</span>
            </div>
            <div className="section-card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={mockAnalyticsData.fieldDistribution}
                  layout="vertical"
                  margin={{ left: 0, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--neutral-100)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
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
                    type="category"
                    dataKey="field"
                    width={130}
                    tick={{
                      fontSize: 11.5,
                      fill: "var(--neutral-600)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 600,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                  <Bar dataKey="count" name="Papers" radius={[0, 6, 6, 0]}>
                    {mockAnalyticsData.fieldDistribution.map(
                      (_entry, index) => (
                        <Cell
                          key={index}
                          fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                        />
                      ),
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Grid.Col>

        {/* Researcher Profile Radar */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Research Profile</span>
            </div>
            <div className="section-card-body">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--neutral-150)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fontSize: 11,
                      fill: "var(--neutral-500)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#c9184a"
                    fill="#c9184a"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Grid.Col>

        {/* Top Cited Papers */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">Top Cited Papers</span>
            </div>
            <div className="section-card-body" style={{ padding: 0 }}>
              {mockAnalyticsData.topCitedPapers.map((paper, i) => {
                const maxCitations =
                  mockAnalyticsData.topCitedPapers[0].citations;
                const pct = (paper.citations / maxCitations) * 100;
                return (
                  <div
                    key={i}
                    style={{
                      padding: "12px 20px",
                      borderBottom:
                        i < mockAnalyticsData.topCitedPapers.length - 1
                          ? "1px solid var(--neutral-100)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Text
                        size="16px"
                        fw={900}
                        style={{
                          color:
                            i === 0 ? "var(--color-700)" : "var(--neutral-300)",
                          width: "18px",
                          flexShrink: 0,
                          textAlign: "center",
                        }}
                      >
                        {i + 1}
                      </Text>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          size="12.5px"
                          fw={700}
                          c="var(--neutral-800)"
                          lineClamp={1}
                          style={{ marginBottom: "5px" }}
                        >
                          {paper.title}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            className="progress-bar-container"
                            style={{ flex: 1 }}
                          >
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <Text
                            size="12px"
                            fw={800}
                            style={{ color: "var(--color-700)", flexShrink: 0 }}
                          >
                            {paper.citations}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid.Col>

        {/* Journal Tier Distribution */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">
                Journal Tier Distribution
              </span>
            </div>
            <div className="section-card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={journalDistribution}
                  margin={{ top: 5, right: 10, bottom: 0, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--neutral-100)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
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
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                  <Bar dataKey="value" name="Papers" radius={[6, 6, 0, 0]}>
                    {journalDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
}
