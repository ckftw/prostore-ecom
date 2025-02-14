import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const PurchaseEmailReceipt = ({ order }: { order: Order }) => {
  return (
    <Html>
      <Preview>View Order Recepit</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>

                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>

                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border-solid border border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.orderitems.map((item) => (
                <Row key={item.productId} className="mt-9">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>

                  <Column className='align-top'>
                    {item.name} x {item.qty}
                  </Column>

                  <Column align='right' className='align-top'>
                    {formatCurrency(item.price)}
                  </Column>

                </Row>
              ))}
              {
                [
                  { name: 'Items', price: order.itemsPrice },
                  { name: 'Tax', price: order.taxPrice },
                  { name: 'Shipping', price: order.shippingPrice },
                  { name: 'Total', price: order.totalPrice },
                ].map(({ name, price }) => (
                  <Row key={name} className='py-4'>
                    <Column align='right'>{name}:</Column>
                    <Column width={70} className='align-top' align='right'>
                      <Text className='m-0'>{formatCurrency(price)}</Text>
                    </Column>
                  </Row>
                ))
              }
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PurchaseEmailReceipt;
