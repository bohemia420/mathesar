# Generated by Django 3.1.7 on 2021-07-29 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mathesar', '0016_auto_20210728_2156'),
    ]

    operations = [
        migrations.AddField(
            model_name='datafile',
            name='base_name',
            field=models.CharField(default='', max_length=128),
            preserve_default=False,
        ),
    ]
