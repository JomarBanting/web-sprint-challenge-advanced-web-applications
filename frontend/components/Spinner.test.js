// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import { render } from "@testing-library/react"
import React from "react";

test("Spinner renders correctly", () => {
render(<Spinner on={true}/>)
})

test('sanity', () => {
  expect(true).toBe(true)
})
