import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Autocomplete from "../components/Autocomplete/autocomplete";
import type { AutocompleteOption } from "../hooks/useAsyncAutocomplete";

const MOCK_OPTIONS: AutocompleteOption[] = [
  { id: "1", label: "Engineering" },
  { id: "2", label: "Marketing" },
  { id: "3", label: "Finance" },
];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Autocomplete", () => {
  it("renders with placeholder, shows loading spinner on focus, and displays suggestions after fetch", async () => {
    // Arrange
    const { promise, resolve: resolveOptions } =
      deferred<AutocompleteOption[]>();
    const fetchOptions = jest.fn().mockReturnValue(promise);
    const onChange = jest.fn();

    render(
      <Autocomplete
        value=""
        onChange={onChange}
        fetchOptions={fetchOptions}
        placeholder="Type a department"
        debounceMs={0}
      />,
    );

    const input = screen.getByRole("combobox");

    // Assert – initial
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Type a department");

    // Act
    fireEvent.focus(input);

    // Assert – loading state
    expect(fetchOptions).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("status", { name: /loading options/i }),
    ).toBeInTheDocument();

    // Act – resolve the in-flight fetch
    await act(async () => {
      resolveOptions(MOCK_OPTIONS);
    });

    // Assert - final state
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Engineering" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Marketing" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Finance" })).toBeInTheDocument();
  });

  it("filters suggestions as the user types and calls onChange when selecting an option", async () => {
    // Arrange
    const fetchOptions = jest.fn().mockResolvedValue(MOCK_OPTIONS);
    const onChange = jest.fn();

    render(
      <Autocomplete
        value=""
        onChange={onChange}
        fetchOptions={fetchOptions}
        placeholder="Type a department"
        debounceMs={0}
      />,
    );

    const input = screen.getByRole("combobox");

    // Act – trigger focus
    fireEvent.focus(input);
    await waitFor(() => expect(fetchOptions).toHaveBeenCalledTimes(1));

    // Assert – initial
    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: "Engineering" }),
      ).toBeInTheDocument(),
    );

    // Act
    fireEvent.change(input, { target: { value: "Eng" } });

    // Assert
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Engineering" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: "Marketing" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: "Finance" }),
      ).not.toBeInTheDocument();
    });
    expect(onChange).toHaveBeenCalledWith("Eng");

    // Act – select an option
    fireEvent.mouseDown(screen.getByRole("option", { name: "Engineering" }));

    // Assert – final state when an option is selected
    expect(onChange).toHaveBeenCalledWith("Engineering");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
