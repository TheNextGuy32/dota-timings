import Timer from "@/components/Timer";
import TimingOptIn from "@/components/TimingOptIn";

export default function App() {
    return (
        <div className="landing-page-content">
            <h1>Dota Timings</h1>
            <Timer />
            <TimingOptIn />
        </div>
    );
}
