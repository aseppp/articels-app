import React from "react";
import { Box, Button, SimpleGrid, SkeletonText, Text } from "@chakra-ui/react";
import useSwr from "swr";
import Link from "next/link";
import { BsBookmarkFill } from "react-icons/bs";
import { useSession } from "next-auth/react";

const Posts = () => {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSwr("/api/post/getAll", fetcher);
  const session = useSession();

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  if (isLoading) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }

  const handleFavourites = async (postId) => {
    const data = {
      userId: session.data.user.id,
      postId: postId,
    };
    await fetch("/api/post/favourites", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <>
      <Box>
        <Text
          fontWeight="semibold"
          fontSize={["xl", "xl", "3xl", "3xl"]}
          marginY="3"
        >
          All Articles
        </Text>
      </Box>

      <SimpleGrid columns={[1, 2, 3]} spacing="40px">
        {data &&
          data.map((item, key) => (
            <Box
              key={key}
              rounded="md"
              boxShadow="lg"
              border="1px"
              maxHeight="32"
              display="flex"
              justifyContent="center"
              flexDirection="column"
            >
              <Link href={`/post/${item.id}`}>
                <Box>
                  <Box padding={1}>
                    <Text fontWeight="semibold" margin={2} fontSize="sm">
                      {item.title}
                    </Text>
                  </Box>
                </Box>
              </Link>

              <Box>
                <Button
                  variant="link"
                  onClick={() => handleFavourites(item.id)}
                >
                  <BsBookmarkFill />
                </Button>
              </Box>
            </Box>
          ))}
      </SimpleGrid>
    </>
  );
};

export default Posts;
