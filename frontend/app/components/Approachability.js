/**
 * Given the intensity of the emotions, provides corresponding tips and feedback.
 *
 */
const getFeedback = (emotions) => {
    if (!emotions) return null;

    const feedback = [];
    const tips = [];

    // Convert to percentages for easier reading
    const happy = emotions.happy || 0;
    const neutral = emotions.neutral || 0;
    const angry = emotions.angry || 0;
    const fear = emotions.fear || 0;
    const sad = emotions.sad || 0;

    // Analyze approachability
    if (happy > 90) {
        feedback.push("Your smile might appear forced");
        tips.push("Try to relax your smile slightly for a more natural look");
    } else if (happy >= 40 && happy <= 90 && neutral >= 20) {
        feedback.push("Good natural expression!");
        tips.push("This balanced smile-neutral mix appears approachable");
    }

    if (angry > 5) {
        feedback.push("You might appear stern");
        tips.push("Try to relax your eyebrows and forehead");
    }

    if (fear > 5) {
        feedback.push("You might appear anxious");
        tips.push("Take a deep breath and try to relax your facial muscles");
    }

    if (sad > 5) {
        feedback.push("Your expression might appear downcast");
        tips.push("Try lifting your cheeks slightly and maintaining soft eye contact");
    }

    if (neutral > 90) {
        feedback.push("Your expression might appear too reserved");
        tips.push("Try adding a slight smile to appear more approachable");
    } else if (neutral >= 20 && neutral <= 90 && happy >= 40) {
        feedback.push("Good engagement level!");
        tips.push("This mix of expressions appears attentive and friendly");
    }

    // If all emotions are relatively balanced and no strong negatives
    if (happy >= 20 && happy <= 90 &&
        neutral >= 20 && neutral <= 90 &&
        angry < 5 && fear < 5 && sad < 5) {
        feedback.push("Excellent approachable expression!");
        tips.push("You're maintaining a great balance of friendly and professional");
    }

    return {
        feedback,
        tips,
        approachabilityScore: calculateApproachabilityScore(emotions)
    };
};

const calculateApproachabilityScore = (emotions) => {
    if (!emotions) return 0;

    // Base score on positive/neutral emotions and penalize negative ones
    const score =
        (emotions.happy * 1.0) +  // Weight happiness positively but not too much
        (emotions.neutral * 0.8) + // Some neutral is good
        (100 - emotions.angry * 1.0) + // Heavily penalize anger
        (100 - emotions.fear * 0.8) + // Penalize fear
        (100 - emotions.sad * 0.8);   // Penalize sadness

    // Normalize to 0-100 range
    return Math.min(Math.max(Math.round(score / 5), 0), 100);
};

export default function ApproachabilityFeedback({ emotions }) {
    const feedbackData = getFeedback(emotions);

    if (!feedbackData) return null;

    return (
        <div className="mt-6 space-y-4">
            <div className="p-4 bg-white rounded shadow">
                <h3 className="text-lg font-bold mb-2">Approachability Score</h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                            className="h-6 rounded-full transition-all duration-500"
                            style={{
                                width: `${feedbackData.approachabilityScore}%`,
                                backgroundColor: `hsl(${feedbackData.approachabilityScore * 1.2}, 70%, 50%)`
                            }}
                        />
                    </div>
                    <span className="font-bold min-w-[3rem]">{feedbackData.approachabilityScore}%</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            Current Analysis
                        </h4>
                        <ul className="space-y-2 ml-6 list-disc">
                            {feedbackData.feedback.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            Tips for Improvement
                        </h4>
                        <ul className="space-y-2 ml-6 list-disc">
                            {feedbackData.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
