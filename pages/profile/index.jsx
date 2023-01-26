import Head from "next/head";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BsHeartFill, BsHeart, BsTrash } from "react-icons/bs";
import useSwr from "swr";

const Home = () => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSwr(`/api/post/user/${session?.user?.id}`, fetcher, {
    refreshInterval: 1000,
  });

  const deletePost = async (postId) => {
    try {
      await fetch(`/api/post/delete/${postId}`, {
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
        <title>Profile | Articles</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="1000px" position="relative" padding={1}>
        <Center py={6}>
          <Box
            w="xs"
            rounded={"sm"}
            my={5}
            mx={[0, 5]}
            overflow={"hidden"}
            bg="white"
            border={"1px"}
            borderColor="black"
            boxShadow={useColorModeValue("6px 6px 0 black", "6px 6px 0 gray")}
          >
            <Box h={"200px"} borderBottom={"1px"} borderColor="black">
              <Image
                src={session?.user?.image}
                roundedTop={"sm"}
                objectFit="cover"
                h="full"
                w="full"
                alt={"Blog Image"}
                referrerPolicy="no-referrer"
              />
            </Box>
            <Box p={4}>
              <Box
                bg="black"
                display={"inline-block"}
                px={2}
                py={1}
                color="white"
                mb={2}
              >
                <Text fontSize={"xs"} fontWeight="medium">
                  Creator
                </Text>
              </Box>
              <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
                {session?.user?.name}
              </Heading>
              <Text color={"gray.500"} noOfLines={2}>
                {session?.user?.email}
                {/* In this post, we will give an overview of what is new in React
                18, and what it means for the future. */}
              </Text>
            </Box>

            <HStack borderTop={"1px"} color="black">
              <Flex
                p={4}
                alignItems="center"
                justifyContent={"space-between"}
                roundedBottom={"sm"}
                cursor={"pointer"}
                w="full"
              >
                <Link href="/post">
                  <Text fontSize={"md"} fontWeight={"semibold"}>
                    Create Post !
                  </Text>
                </Link>
              </Flex>

              <Flex
                p={4}
                alignItems="center"
                justifyContent={"space-between"}
                roundedBottom={"sm"}
                borderLeft={"1px"}
                cursor="pointer"
                onClick={() => setLiked(!liked)}
              >
                {liked ? (
                  <BsHeartFill fill="red" fontSize={"24px"} />
                ) : (
                  <BsHeart fontSize={"24px"} />
                )}
              </Flex>
            </HStack>
          </Box>
        </Center>

        <Box>
          <Text
            fontWeight="semibold"
            fontSize={["xl", "xl", "3xl", "3xl"]}
            marginY="3"
          >
            My Post
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
                  <Button variant="link" onClick={() => deletePost(item.id)}>
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

export default Home;