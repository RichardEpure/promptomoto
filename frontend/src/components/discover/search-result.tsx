import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export function SearchResult() {
    return (
        <Card>
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">Tag</Badge>
                </CardAction>
                <CardTitle>Search Result</CardTitle>
                <CardDescription>
                    This is a description of the search result. It provides more details about the
                    prompt and its content.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button>View Prompt</Button>
            </CardFooter>
        </Card>
    );
}
