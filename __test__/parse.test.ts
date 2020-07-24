import { parse } from "../src/parse";

const testXml = `<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
<file name="Librarian\\sample\\feature\\src\\main\\kotlin\\net\\meilcli\\librarian\\sample\\dynamic\\feature\\Test.kt">
	<error line="3" column="12" severity="info" message="The class or object Test is empty." source="detekt.EmptyClassBlock" />
	<error line="3" column="12" severity="warning" message="Unnecessary block (&quot;{}&quot;)" source="detekt.NoEmptyClassBody" />
</file>
<file name="Librarian\\sample\\feature\\src\\main\\kotlin\\net\\meilcli\\librarian\\sample\\dynamic\\feature\\Test.kt">
	<error line="3" column="12" severity="info" message="The class or object Test is empty." source="detekt.EmptyClassBlock" />
</file>
</checkstyle>
`;

const testEmptyXml1 = `<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
</checkstyle>
`;

const testEmptyXml2 = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
<file name="Librarian\\sample\\feature\\src\\main\\kotlin\\net\\meilcli\\librarian\\sample\\dynamic\\feature\\Test.kt">
</file>
</checkstyle>
`;

test("parse", async () => {
    const result = await parse(testXml);
    expect(result.issues.length).toBe(3);
    expect(result.issues[0].severity).toBe("info");
    expect(result.issues[0].id).toBe("EmptyClassBlock");
    expect(result.issues[1].severity).toBe("warning");
    expect(result.issues[1].id).toBe("NoEmptyClassBody");
    expect(result.issues[2].severity).toBe("info");
    expect(result.issues[2].id).toBe("EmptyClassBlock");
});

test("parseEmpty1", async () => {
    const result = await parse(testEmptyXml1);
    expect(result.issues.length).toBe(0);
});

test("parseEmpty2", async () => {
    const result = await parse(testEmptyXml2);
    expect(result.issues.length).toBe(0);
});
