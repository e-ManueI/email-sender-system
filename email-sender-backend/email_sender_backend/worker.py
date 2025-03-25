import pika
import time
import smtplib
from email.mime.text import MIMEText
from django.core.mail import send_mail
import json

def email_worker():
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='email_queue', durable=True)
    
    def callback(ch, method, properties, body):
            try:
                data = json.loads(body.decode())
                name = data['name']
                email = data['email']
                message = data['message']
                send_mail(
                    subject=f'Hello {name}',
                    message=message,
                    from_email='manueltylan@gmail.com',
                    recipient_list=[email],
                    fail_silently=False,
                )
                time.sleep(1)  # Ensure one email per second
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print(f'Error processing message: {e}')
                ch.basic_ack(delivery_tag=method.delivery_tag)  # Acknowledge even on failure
    
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='email_queue', on_message_callback=callback)
    print('Starting worker....')
    channel.start_consuming()