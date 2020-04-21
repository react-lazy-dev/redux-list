import React, { ReactNode } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import List, { Props as ListProps } from "./index";

interface TestRowProps {
  id: number;
  label: string;
}

function TestRow({ id, label }: TestRowProps) {
  return (
    <div>
      {id} - {label}
    </div>
  );
}

interface TestEmptyProps {
  className?: string;
  message: string;
}

function TestEmpty({ message }: TestEmptyProps) {
  return (
    <>
      <span>custom message:</span> {message}
    </>
  );
}

const sharedProps: ListProps<TestRowProps, TestRowProps> = {
  RowComponent: TestRow,
  rows: [
    { id: 10, label: "A" },
    { id: 11, label: "B" },
    { id: 12, label: "C" }
  ],
  rowKey: row => row.id,
};

describe("The List component tests", () => {
  it("Should render custom EmptyComponent and message", () => {
    const { queryByText } = render(
      <List<TestRowProps, TestRowProps>
        {...sharedProps}
        rows={[]}
        EmptyComponent={TestEmpty}
      />
    );
    expect(queryByText("custom message:")).toBeInTheDocument();
  });

  it("Should not render EmptyComponent if hasEmpty is false", () => {
    const { queryByTestId } = render(
      <List {...sharedProps} rows={[]} hasEmpty={false} />
    );
    expect(queryByTestId("empty-component")).toBeNull();
  });

  it("Should render beforeRows and afterRows at correct positions", () => {
    const beforeRows = <span data-testid="before-rows" />;
    const afterRows = <span data-testid="after-rows" />;
    const { getByTestId } = render(
      <List {...sharedProps} beforeRows={beforeRows} afterRows={afterRows} />
    );
    expect(getByTestId("root").firstChild).toBe(getByTestId("before-rows"));
    expect(getByTestId("root").lastChild).toBe(getByTestId("after-rows"));
  });

  it("Should render custom container", () => {
    function CustomContainer({ children }: { children: ReactNode }) {
      return (
        <section data-testid="custom-root">
          {children}
        </section>
      );
    }
    const { getByTestId } = render(
      <List {...sharedProps} Container={CustomContainer} />
    );

    expect(getByTestId("custom-root")).toBeInTheDocument();
  });
});
