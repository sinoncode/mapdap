import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

type Shape = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    width: number;
    height: number;
};

async function run() {
    const pdfPath =
        "./pdf/RE26_HallC_1780386778051.pdf";

    const data = new Uint8Array(
        fs.readFileSync(pdfPath)
    );

    const pdf = await pdfjs.getDocument({
        data,
    }).promise;

    const page =
        await pdf.getPage(1);

    const operatorList =
        await page.getOperatorList();

    const OPS = pdfjs.OPS;

    const opMap = new Map<number, string>(
        Object.entries(OPS).map(
            ([name, value]) => [
                value as number,
                name,
            ]
        )
    );

    // -----------------------------------
    // Extract Shapes
    // -----------------------------------

    const shapes: Shape[] = [];

    for (
        let i = 0;
        i < operatorList.fnArray.length;
        i++
    ) {
        const op =
            operatorList.fnArray[i];

        const opName =
            opMap.get(op);

        if (
            opName !==
            "constructPath"
        )
            continue;

        const args =
            operatorList.argsArray[i];

        const bbox = args?.[2];

        if (!bbox) continue;

        const x1 = bbox[0];
        const y1 = bbox[1];

        const x2 = bbox[2];
        const y2 = bbox[3];

        const width =
            x2 - x1;

        const height =
            y2 - y1;

        if (
            width < 2 ||
            height < 2
        )
            continue;

        shapes.push({
            x1,
            y1,
            x2,
            y2,
            width,
            height,
        });
    }

    console.log(
        `Found ${shapes.length} shapes`
    );

    // -----------------------------------
    // Extract Text
    // -----------------------------------

    const textContent =
        await page.getTextContent();

    const items = (
        textContent.items as any[]
    )
        .map((item) => ({
            text:
                item.str?.trim() ?? "",

            x: item.transform[4],

            y: item.transform[5],
        }))
        .filter(
            (item) =>
                item.text.length > 0
        );

    const boothRegex =
        /^W\d{5}$/;

    const booths =
        items.filter((item) =>
            boothRegex.test(
                item.text
            )
        );

    console.log(
        `Found ${booths.length} booth IDs`
    );

    // -----------------------------------
    // Exhibitor Name Matching
    // -----------------------------------

    function findExhibitorName(
        booth: {
            text: string;
            x: number;
            y: number;
        }
    ) {
        const nearby =
            items.filter(
                (item) =>
                    !boothRegex.test(
                        item.text
                    ) &&
                    Math.abs(
                        item.x - booth.x
                    ) < 40 &&
                    Math.abs(
                        item.y - booth.y
                    ) < 35
            );

        return nearby
            .sort(
                (a, b) =>
                    Math.abs(
                        a.y - booth.y
                    ) -
                    Math.abs(
                        b.y - booth.y
                    )
            )
            .slice(0, 3)
            .map(
                (item) => item.text
            )
            .join(" ")
            .trim();
    }

    // -----------------------------------
    // Find Booth Shape
    // -----------------------------------

    const usedShapes = new Set<number>();

    function findShape(
        boothX: number,
        boothY: number
    ) {
        const margin = 3;

        return (
            shapes.find(
                (shape) =>
                    boothX >=
                    shape.x1 - margin &&
                    boothX <=
                    shape.x2 + margin &&
                    boothY >=
                    shape.y1 - margin &&
                    boothY <=
                    shape.y2 + margin
            ) ?? null
        );
    }

    // -----------------------------------
    // Coordinate Range
    // -----------------------------------

    const minX = Math.min(
        ...booths.map(
            (b) => b.x
        )
    );

    const maxX = Math.max(
        ...booths.map(
            (b) => b.x
        )
    );

    const minY = Math.min(
        ...booths.map(
            (b) => b.y
        )
    );

    const maxY = Math.max(
        ...booths.map(
            (b) => b.y
        )
    );

    // -----------------------------------
    // Final JSON
    // -----------------------------------

    const finalBooths =
        booths.map((booth) => {
            const shape =
                findShape(
                    booth.x,
                    booth.y
                );

            if (!shape) {
                console.log(
                    "NO SHAPE:",
                    booth.text
                );
            }

            const centerX =
                shape
                    ? (shape.x1 +
                        shape.x2) /
                    2
                    : booth.x;

            const centerY =
                shape
                    ? (shape.y1 +
                        shape.y2) /
                    2
                    : booth.y;

            return {
                id: booth.text,

                name:
                    findExhibitorName(
                        booth
                    ),

                pdfX: booth.x,
                pdfY: booth.y,

                x:
                    ((centerX -
                        minX) /
                        (maxX -
                            minX)) *
                    180 -
                    90,

                z:
                    ((centerY -
                        minY) /
                        (maxY -
                            minY)) *
                    120 -
                    60,

                width:
                    shape?.width ??
                    6,

                depth:
                    shape?.height ??
                    6,

                shape:
                    shape ?? null,
            };
        });

    const matched =
        finalBooths.filter(
            (b) => b.shape
        ).length;

    console.log(
        `Matched ${matched} / ${finalBooths.length}`
    );

    fs.mkdirSync(
        "./src/data",
        {
            recursive: true,
        }
    );

    fs.writeFileSync(
        "./src/data/hall-layout.json",
        JSON.stringify(
            finalBooths,
            null,
            2
        )
    );

    console.log(
        `Generated ${finalBooths.length} booths`
    );

    console.log(
        finalBooths.slice(
            0,
            5
        )
    );
}

run().catch(console.error);