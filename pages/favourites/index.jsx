import React from "react";
import Head from "next/head";
import useSwr from "swr";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Link,
  SimpleGrid,
  SkeletonText,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";

const index = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSwr(
    `/api/post/favourites/${session?.user?.id}`,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  if (error) return <div>Failed to load</div>;
  if (!data) {
    return (
      <Container maxW="1000px" position="relative" padding={1} boxShadow="lg">
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      </Container>
    );
  }

  const deleteFav = async (id) => {
    try {
      await fetch(`/api/post/deleteFav/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Head>
        <title>Favourites | Articles</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="1000px" position="relative" padding={1}>
        <Box>
          <Text
            fontWeight="semibold"
            fontSize={["md", "md", "md", "md"]}
            marginY="3"
          >
            My Favourites
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
                height="24"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                gap={3}
              >
                <Link href={`/post/${item.post.id}`}>
                  <Box>
                    <Box padding={1}>
                      <Text fontWeight="semibold" margin={2} fontSize="sm">
                        {item.post.title}
                      </Text>
                    </Box>
                  </Box>
                </Link>

                <Box>
                  <Button
                    variant="link"
                    onClick={() => {
                      deleteFav(item.id),
                        toast({
                          title: "Deleted from favourites.",
                          // description: "We've created your account for you.",
                          status: "success",
                          duration: 3000,
                          isClosable: false,
                          position: "bottom-left",
                        });
                    }}
                  >
                    <BsTrash />
                  </Button>
                </Box>
              </Box>
            ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default index;
