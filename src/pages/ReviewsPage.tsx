import { useState, useRef, useEffect } from "react";
import { Text, Group, Modal, Stack, Divider, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import {
  RiStarFill,
  RiStarLine,
  RiSendPlaneLine,
  RiFileTextLine,
  RiCheckLine,
  RiRefreshLine,
  RiDownloadLine,
  RiCalendarLine,
  RiUserLine,
  RiQuillPenLine,
  RiLightbulbLine,
} from "react-icons/ri";
import { mockReviews } from "../data/mockData";
import { notifications } from "@mantine/notifications";
import { PiWarningDiamondFill } from "react-icons/pi";

const CRITERIA_LABELS: Record<string, string> = {
  novelty: "Novelty & Originality",
  methodology: "Methodology",
  clarity: "Clarity & Writing",
  significance: "Significance",
  reproducibility: "Reproducibility",
};

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <Group gap={2}>
      {Array.from({ length: max }).map((_, i) =>
        i < Math.floor(value) ? (
          <RiStarFill key={i} size={14} color="var(--warning)" />
        ) : i < value ? (
          <RiStarFill
            key={i}
            size={14}
            color="var(--warning)"
            style={{ opacity: 0.5 }}
          />
        ) : (
          <RiStarLine key={i} size={14} color="var(--neutral-300)" />
        ),
      )}
      <Text size="12px" fw={700} c="var(--neutral-600)" ml={4}>
        {value}/5
      </Text>
    </Group>
  );
}

function CriteriaBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  const color =
    value >= 4
      ? "var(--success)"
      : value >= 3
        ? "var(--warning)"
        : "var(--error)";
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <Text size="12.5px" fw={600} c="var(--neutral-600)">
          {label}
        </Text>
        <Text size="12.5px" fw={800} style={{ color }}>
          {value}/5
        </Text>
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; barClass: string }
> = {
  pending_response: {
    label: "Response Required",
    color: "#b45309",
    bg: "var(--warning-light)",
    barClass: "pending",
  },
  in_revision: {
    label: "In Revision",
    color: "#0369a1",
    bg: "var(--info-light)",
    barClass: "revision",
  },
  accepted: {
    label: "Accepted",
    color: "#0a8a4c",
    bg: "var(--success-light)",
    barClass: "accepted",
  },
  rejected: {
    label: "Rejected",
    color: "#b42318",
    bg: "var(--error-light)",
    barClass: "rejected",
  },
};

function ReviewCard({ review, onRespond, onView }: any) {
  const config = STATUS_CONFIG[review.status] || STATUS_CONFIG.pending_response;

  return (
    <div className="review-card animate-fade-up">
      <div className={`review-status-bar`} />
      <div className="review-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text
            size="14.5px"
            fw={800}
            style={{
              color: "var(--neutral-900)",
              letterSpacing: "-0.01em",
              marginBottom: "4px",
            }}
            lineClamp={1}
          >
            {review.paperTitle}
          </Text>
          <Text size="12px" fw={600} style={{ color: "var(--color-700)" }}>
            {review.journal}
          </Text>
        </div>
        <span
          style={{
            fontSize: "11.5px",
            fontWeight: 700,
            padding: "4px 10px",
            background: config.bg,
            color: config.color,
            borderRadius: "99px",
            flexShrink: 0,
            marginLeft: "10px",
          }}
        >
          {config.label}
        </span>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Reviewer + Date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <Group gap={6}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--neutral-200)",
                color: "var(--neutral-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RiUserLine size={13} />
            </div>
            <Text size="12.5px" fw={700} c="var(--neutral-600)">
              {review.reviewerAlias}
            </Text>
          </Group>
          <Group gap={5}>
            <RiCalendarLine size={13} color="var(--neutral-400)" />
            <Text size="12px" fw={600} c="var(--neutral-400)">
              {review.reviewDate}
            </Text>
          </Group>
          <Group gap={5}>
            <Text size="12px" fw={700} c="var(--neutral-600)">
              Decision:
            </Text>
            <Text
              size="12px"
              fw={800}
              style={{
                color: review.decision.includes("Minor")
                  ? "var(--success)"
                  : "var(--warning)",
              }}
            >
              {review.decision}
            </Text>
          </Group>
        </div>

        {/* Overall Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
            padding: "10px 14px",
            background: "var(--neutral-50)",
            borderRadius: "10px",
          }}
        >
          <Text size="12.5px" fw={700} c="var(--neutral-600)">
            Overall Score
          </Text>
          <StarRating value={review.overallScore} />
        </div>

        {/* Comments Preview */}
        <div style={{ marginBottom: "16px" }}>
          <Text size="12.5px" fw={800} c="var(--neutral-700)" mb={6}>
            Reviewer Comments
          </Text>
          <div
            style={{
              background: "var(--neutral-50)",
              borderRadius: "8px",
              padding: "12px 14px",
              border: "1px solid var(--neutral-150)",
            }}
          >
            <Text
              size="12.5px"
              c="var(--neutral-600)"
              style={{ lineHeight: 1.6, whiteSpace: "pre-line" }}
              lineClamp={4}
            >
              {review.comments}
            </Text>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            className="btn-ghost"
            onClick={() => onView(review)}
            style={{ fontSize: "12.5px" }}
          >
            <RiFileTextLine size={13} /> View Full Review
          </button>
          {review.status === "pending_response" && (
            <button
              className="btn-primary"
              onClick={() => onRespond(review)}
              style={{ fontSize: "12.5px" }}
            >
              <RiQuillPenLine size={13} /> Write Response
            </button>
          )}
          {review.status === "in_revision" && (
            <button
              className="btn-secondary"
              onClick={() => onRespond(review)}
              style={{ fontSize: "12.5px" }}
            >
              <RiRefreshLine size={13} /> Continue Revision
            </button>
          )}
          <button className="btn-ghost" style={{ fontSize: "12.5px" }}>
            <RiDownloadLine size={13} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReviewsPage() {
  const [reviews] = useState(mockReviews);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [respondOpened, { open: openRespond, close: closeRespond }] =
    useDisclosure(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const handleView = (review: any) => {
    setSelectedReview(review);
    openDetail();
  };

  const handleRespond = (review: any) => {
    setSelectedReview(review);
    setResponse("");
    openRespond();
  };

  const handleSubmitResponse = () => {
    closeRespond();
    notifications.show({
      title: "Response Submitted",
      message: "Your response to the reviewer has been submitted successfully.",
      color: "green",
      icon: <RiCheckLine />,
    });
  };

  const avgScore =
    reviews.reduce((acc, r) => acc + r.overallScore, 0) / reviews.length;
  const pendingCount = reviews.filter(
    (r) => r.status === "pending_response",
  ).length;

  return (
    <div className="page-wrapper">
      <div className="page-header" ref={headerRef}>
        <div>
          <h1 className="page-title">Peer Reviews</h1>
          <p className="page-subtitle">
            Manage reviewer feedback and prepare your responses
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Total Reviews",
            value: reviews.length,
            color: "var(--neutral-700)",
          },
          {
            label: "Pending Response",
            value: pendingCount,
            color: "var(--warning)",
          },
          {
            label: "In Revision",
            value: reviews.filter((r) => r.status === "in_revision").length,
            color: "var(--info)",
          },
          {
            label: "Avg. Score",
            value: `${avgScore.toFixed(1)}/5`,
            color: "var(--warning)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ flex: "1", minWidth: "130px" }}
          >
            <div
              className="stat-card-value"
              style={{ fontSize: "24px", color: s.color }}
            >
              {s.value}
            </div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alert banner if pending */}
      {pendingCount > 0 && (
        <div
          style={{
            border: "2px solid #fcd34d",
            borderRadius: "3px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
          className="animate-fade-up"
        >
          <span>
            <PiWarningDiamondFill size={20} color="var(--warning)" />
          </span>
          <div>
            <Text size="13.5px" fw={800} style={{ color: "#92400e" }}>
              {pendingCount} review{pendingCount > 1 ? "s" : ""} awaiting your
              response
            </Text>
            <Text size="12.5px" style={{ color: "#b45309" }}>
              Respond promptly to maintain good standing with journal editors.
            </Text>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <Stack gap="md">
          {reviews.map((review, i) => (
            <div key={review.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <ReviewCard
                review={review}
                onView={handleView}
                onRespond={handleRespond}
              />
            </div>
          ))}
        </Stack>
      ) : (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">No reviews yet</div>
            <div className="empty-state-desc">
              Submit your papers to journals to receive peer reviews
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        opened={detailOpened && !!selectedReview}
        onClose={closeDetail}
        title="Full Peer Review"
        size="lg"
        centered
      >
        {selectedReview && (
          <Stack gap="md">
            <div>
              <Text
                size="15px"
                fw={800}
                style={{ color: "var(--neutral-900)", marginBottom: "4px" }}
              >
                {selectedReview.paperTitle}
              </Text>
              <Text size="13px" c="var(--neutral-500)">
                {selectedReview.journal}
              </Text>
            </div>
            <Divider />

            {/* Score Breakdown */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px",
                }}
              >
                <Text size="13px" fw={800} c="var(--neutral-700)">
                  Score Breakdown
                </Text>
                <Group gap={6}>
                  <Text size="12.5px" fw={700} c="var(--neutral-500)">
                    Overall:
                  </Text>
                  <StarRating value={selectedReview.overallScore} />
                </Group>
              </div>
              {Object.entries(selectedReview.criteria).map(([key, val]) => (
                <CriteriaBar
                  key={key}
                  label={CRITERIA_LABELS[key] || key}
                  value={val as number}
                />
              ))}
            </div>

            <Divider />

            {/* Full Comments */}
            <div>
              <Text size="13px" fw={800} c="var(--neutral-700)" mb={8}>
                Reviewer Comments
              </Text>
              <div
                style={{
                  background: "var(--neutral-50)",
                  borderRadius: "10px",
                  padding: "16px",
                  border: "1px solid var(--neutral-150)",
                  whiteSpace: "pre-line",
                }}
              >
                <Text
                  size="13px"
                  c="var(--neutral-700)"
                  style={{ lineHeight: 1.7 }}
                >
                  {selectedReview.comments}
                </Text>
              </div>
            </div>

            <Group justify="flex-end" gap={10}>
              <button className="btn-ghost" onClick={closeDetail}>
                Close
              </button>
              {selectedReview.status === "pending_response" && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    closeDetail();
                    handleRespond(selectedReview);
                  }}
                >
                  <RiQuillPenLine size={14} /> Write Response
                </button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal
        opened={respondOpened && !!selectedReview}
        onClose={closeRespond}
        title="Write Reviewer Response"
        size="lg"
        centered
      >
        {selectedReview && (
          <Stack gap="md">
            <div
              style={{
                background: "var(--neutral-50)",
                borderRadius: "10px",
                padding: "12px 14px",
                border: "1px solid var(--neutral-150)",
              }}
            >
              <Text size="12px" fw={800} c="var(--neutral-500)" mb={4}>
                Responding to
              </Text>
              <Text size="13.5px" fw={700} c="var(--neutral-800)">
                {selectedReview.reviewerAlias} — {selectedReview.paperTitle}
              </Text>
            </div>

            <div
              style={{
                background: "var(--color-100)",
                border: "1px solid var(--color-200)",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
            >
              <Text
                size="12px"
                fw={800}
                style={{ color: "var(--color-700)", marginBottom: "4px" }}
              >
                <RiLightbulbLine size={12} style={{ marginRight: "4px" }} />
                AI Writing Tip
              </Text>
              <Text
                size="12px"
                style={{ color: "var(--color-800)", lineHeight: 1.5 }}
              >
                Address each comment specifically, thank the reviewer for their
                feedback, and describe every change made with section/line
                numbers.
              </Text>
            </div>

            <Textarea
              label="Your Response"
              placeholder="Dear Reviewer,&#10;&#10;Thank you for your thorough and constructive feedback. We have carefully considered all comments and made the following revisions:&#10;&#10;Comment 1: ..."
              minRows={10}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              styles={{ label: { fontWeight: 700 } }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text size="12px" c="var(--neutral-400)">
                {response.length} characters
              </Text>
              <Group gap={10}>
                <button className="btn-ghost" onClick={closeRespond}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmitResponse}
                  disabled={!response.trim()}
                >
                  <RiSendPlaneLine size={14} /> Submit Response
                </button>
              </Group>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
