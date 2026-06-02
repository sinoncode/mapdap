import booths from "@/data/hall-layout.json";
import Booth from "./Booth";

export default function Booths() {
    return (
        <>
            {booths.map(
                (booth) => (
                    <Booth
                        key={booth.id}
                        {...booth}
                    />
                )
            )}
        </>
    );
}